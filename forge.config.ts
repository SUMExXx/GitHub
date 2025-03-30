import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './public/Github.ico',
    name: 'Github',
    appBundleId: 'com.sumexxx.github',
    executableName: 'Github',
    overwrite: true, 
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: './public/Github.ico',
      name: 'Github',
      title: 'Github',
      noMsi: false,
      description: 'Github',
      authors: 'Suman Debnath',
      exe: 'Github.exe',
      setupExe: 'GithubInstaller.exe',
      setupMsi: 'GithubInstaller.msi',
      iconUrl: 'https://sumexxx.github.io/Github/Github.ico'
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({
      options: {
        description: 'Github',
        homepage: 'https://sumexxx.github.io/Github/', 
        license: 'MIT',
        icon: './public/Github.ico',
      },

    }),
    new MakerDeb({
      options: {
        icon: './public/Github.ico',
        homepage: 'https://sumexxx.github.io/Github/',
        description: 'Github',
        maintainer: 'Suman Debnath <sumexxx666@gmail.com>',                                    
        section: 'utils',                         
        depends: ['libgtk-3-0', 'libnotify4'],
      }
    })
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
