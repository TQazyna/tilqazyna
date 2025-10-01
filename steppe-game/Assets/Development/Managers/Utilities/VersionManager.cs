public class VersionUtility
{
    public string GetVersionNumber()
    {
        // App version, change here
        string versionText = "1.0.8";

        // Bundle version, change here
        string bundleText = "81";

        return versionText + " + " + bundleText;
    }
}