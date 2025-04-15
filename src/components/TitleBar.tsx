import React, { useEffect, useState, useRef } from "react";
import { Subtract16Regular, Dismiss16Regular, ArrowDownload16Regular, ChevronLeft16Regular, ChevronRight16Regular, ArrowClockwise16Filled, ArrowClockwise16Regular, ArrowLeft16Regular, ArrowRight16Regular, ClipboardCheckmark16Regular, Copy16Regular } from "@fluentui/react-icons";
import { github } from "../utils/github";
import MaximizeButton from "./MaximizeButton";
import { env } from "../utils/env";

const TitleBar: React.FC = () => {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const handleMinimize = () => window.electronAPI.minimizeWindow();
    const handleClose = () => window.electronAPI.closeWindow();

    const handleRefresh = () => {
        const webview = document.getElementById(`webview`) as Electron.WebviewTag;
        if (webview) {
            webview.src = github.url;
        }
    };

    const handleBackClick = () => {
        const webview = document.getElementById('webview') as Electron.WebviewTag;
        if (webview && webview.canGoBack()) {
            webview.goBack();
        }
    };

    const handleForwardClick = () => {
        const webview = document.getElementById('webview') as Electron.WebviewTag;
        if (webview && webview.canGoBack()) {
            webview.goForward();
        }
    };

    const [copyStatus, setCopyStatus] = useState<boolean>(false);

    const copyCurrentLinkToClipboard = () => {
        const webview = document.getElementById('webview') as Electron.WebviewTag;
        if (webview && webview.getURL()) {
            const currentURL = webview.getURL();
            navigator.clipboard.writeText(currentURL)
            .then(() => {
                setCopyStatus(true);
                setTimeout(() => {
                    setCopyStatus(false);
                }, 2000); // Reset after 2 seconds
            })
            .catch((err) => console.error('Failed to copy:', err));
        }
    };

    const [updateStatus, setUpdateStatus] = useState<boolean>(false);
    const checkUpdate = () => {
        fetch("https://api.github.com/repos/SUMExXx/GitHub/releases/latest").then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    if (data.tag_name !== env.TAG) {
                        setUpdateStatus(true);
                    }
                });
            }
        });
    };

    const update = () => {};

    const [logo, setLogo] = useState<string | null>(null);

    const setAILogos = () => {
        window.electronAPI.getAssetImage(github.logo).then((logo) => logo && setLogo(logo));
    };

    useEffect(() => {
        checkUpdate();
        setAILogos();
    }, []);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        const checkOverflow = () => {
            if (scrollContainer) {
                setShowLeftButton(scrollContainer.scrollLeft > 0);
                setShowRightButton(
                    scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth
                );
            }
        };

        const handleResize = () => {
            setTimeout(checkOverflow, 50); // Delay check to ensure correct dimensions
        };

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkOverflow);
            window.addEventListener("resize", handleResize);
            checkOverflow(); // Initial check
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", checkOverflow);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="w-full h-[40px] min-h-[40px] bg-background dark:bg-background-dark flex justify-between items-center relative" style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
            <div className="flex h-full items-center justify-center">
                <div className="p-2">
                    <img
                        src={logo ? logo : ""}
                        alt="logo"
                        className="h-6 w-6 min-h-6 min-w-6 max-h-6 max-w-6 p-[2px] bg-white rounded-full object-contain"
                        draggable="false"
                    />
                </div>
                <button type="button" title="Back" onClick={handleBackClick} className="text-ui dark:text-ui-dark dark:hover:bg-uiHover-dark h-full px-[16px] transition-colors duration-200 hover:bg-uiHover flex items-center justify-center outline-none" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                    <ArrowLeft16Regular />
                </button>
                <button type="button" title="Minimize" onClick={handleRefresh} className="text-ui dark:text-ui-dark dark:hover:bg-uiHover-dark h-full px-[16px] transition-colors duration-200 hover:bg-uiHover flex items-center justify-center outline-none" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                    <ArrowClockwise16Regular />
                </button>
                <button type="button" title="Forward" onClick={handleForwardClick} className="text-ui dark:text-ui-dark dark:hover:bg-uiHover-dark h-full px-[16px] transition-colors duration-200 hover:bg-uiHover flex items-center justify-center outline-none" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                    <ArrowRight16Regular />
                </button>
                <button type="button" title="Forward" onClick={copyCurrentLinkToClipboard} className="text-ui dark:text-ui-dark dark:hover:bg-uiHover-dark h-full px-[16px] transition-colors duration-200 hover:bg-uiHover flex items-center justify-center outline-none" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                    {copyStatus? <ClipboardCheckmark16Regular /> : <Copy16Regular />}
                </button>
            </div>

            <div className="h-full flex justify-center items-center">
                {updateStatus && (
                    <button onClick={update} title="Update Available" className="text-ui dark:text-ui-dark dark:hover:bg-uiHover-dark h-full px-[16px] transition-colors duration-200 hover:bg-uiHover flex items-center justify-center outline-none" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                        <ArrowDownload16Regular />
                    </button>
                )}
                <button type="button" title="Minimize" onClick={handleMinimize} className="text-ui dark:text-ui-dark dark:hover:bg-uiHover-dark h-full px-[16px] transition-colors duration-200 hover:bg-uiHover flex items-center justify-center outline-none" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                    <Subtract16Regular />
                </button>
                <MaximizeButton />
                <button type="button" title="Maximize" onClick={handleClose} className="text-ui dark:text-ui-dark dark:hover:bg-uiHover-dark h-full px-[16px] transition-colors duration-200 hover:bg-uiHover flex items-center justify-center outline-none" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                    <Dismiss16Regular />
                </button>
            </div>
        </div>
    );
};

export default TitleBar;
