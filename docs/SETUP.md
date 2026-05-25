# Setup Guide — Make Me Survive

## Changing the app ID / package name

Everything is defined in `capacitor.config.json`:
```json
{
  "appId": "com.makemesurvive.app",
  "appName": "Survival Encyclopedia"
}
```
Change `appId` to your own reverse-domain identifier before building.  
After changing, re-run `npx cap sync android`.

## Changing the app version

Edit `android/app/build.gradle` (after first `cap add android`):
```gradle
versionCode 2        // integer, increment by 1 every release
versionName "1.1.0"  // human-readable version shown in app stores
```

## Adding a custom splash screen and icon

1. Place your icon as `android-config/ic_launcher.png` (1024×1024px)
2. Use Android Studio: File → New → Image Asset → select your PNG
3. Android Studio generates all density variants automatically

## Updating the encyclopedia content

The entire encyclopedia is in `src/index.html`.  
Find the `ARTICLES` array in the `<script>` block to add or edit articles.  
Run `npm run sync` after any edit to copy changes into the Android project.

## Enabling HTTPS for local Ollama AI

Android blocks plain HTTP by default. To use a local Ollama server:

Option A — Use HTTPS with a self-signed cert on your Ollama server.

Option B — Add a network security config. Create `android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="false">192.168.1.100</domain>
    </domain-config>
</network-security-config>
```
Then reference it in AndroidManifest.xml `<application>`:
```xml
android:networkSecurityConfig="@xml/network_security_config"
```

## Building for F-Droid (open source app store)

F-Droid requires reproducible builds and no proprietary dependencies.
1. Ensure `build.gradle` has no Google Play Services dependencies
2. Submit via https://f-droid.org/en/contribute/

## iOS build (requires Mac)

```bash
npm install
npx cap add ios
npx cap sync ios
npx cap open ios
```
Xcode opens. Requires Apple Developer account for device testing.
TestFlight distribution is free with a developer account.

## Signing key security

Never commit your `.keystore` or `.jks` file to git.  
The `.gitignore` already excludes these.  
For CI/CD, store as GitHub Secret (base64 encoded).

Generate a keystore:
```bash
keytool -genkey -v \
  -keystore make-me-survive-release.keystore \
  -alias makemesurvive \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Encode for GitHub Secret:
```bash
# Linux/macOS
base64 -i make-me-survive-release.keystore | pbcopy

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("make-me-survive-release.keystore")) | Set-Clipboard
```
