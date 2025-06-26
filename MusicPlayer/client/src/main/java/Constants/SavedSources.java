package Constants;

/**
 * Contains all saved sources
 */
public class SavedSources {
    private final String[] playlistSources = {"src/main/resources/losowa.m3u"};
    private final String[] folderSources = {"src/main/resources/music"};

    /**
     * returns file sources
     * @return String[] with file sources
     */
    public String[] getPlaylistSources() {
        return playlistSources;
    }

    /**
     * returns folder sources
     * @return String[] with folder sources
     */
    public String[] getFolderSources() {
        return folderSources;
    }
}
