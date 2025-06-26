package Utils;

import FileOperations.ReadDir;
import GUI.MainPanel;

import javax.swing.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Playlist class contains all songs and index of currently playing one
 */
public class Playlist {
    private static Playlist instance;
    private String[] playlist;
    private int currentIndex = 0;

    /**
     * private constructor
     */
    private Playlist() {
        createPlaylistFromFolder("src/main/resources/music");
    }

    /**
     * jump to correct index
     * @param index int
     */
    public void jumpTo(int index) {
        currentIndex = index;
    }

    /**
     * sets index to next
     * if last, starts from zero again
     */
    public void next() {
        currentIndex += 1;
        if (currentIndex >= playlist.length) {
            currentIndex = 0;
        }
    }

    /**
     * sets index to previous
     */
    public void previous() {
        currentIndex -= 1;
        if (currentIndex < 0) {
            currentIndex = playlist.length-1;
        }
    }

    /**
     * updates playlist
     * @param newPlaylist String[] containing paths to songs
     */
    public void updatePlaylist(String[] newPlaylist) {
        playlist = newPlaylist;
        MainPanel.getInstance().playlistUpdate(playlist);
    }

    /**
     * returns instance of Playlist class
     * @return instance
     */
    public static Playlist getInstance() {
        if (instance == null) {
            instance = new Playlist();  // Lazy initialization
        }
        return instance;
    }

    /**
     * gets currently playing song
     * @return String with path to song
     */
    public String getSong() {
        return playlist[currentIndex];
    }

    /**
     * returns whole playlist
     * @return String[] with playlist
     */
    public String[] getPlaylist() {
        if (playlist == null || playlist.length == 0) {  // Ensure playlist is populated
            createPlaylistFromFolder("src/main/resources/music");
        }
        return playlist;
    }

    /**
     * creates and updates playlist from .m3u file
     * @param filePath String containing path to .m3u file
     */
    public void createPlaylistFromFile(String filePath) {
        ArrayList<Object> mediaFiles = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                // Ignore comments or metadata lines, extract only file paths/URLs
                if (!line.isEmpty() && !line.startsWith("#")) {
                    if (line.charAt(1) == ':') {
                        mediaFiles.add(line);
                    } else {
                        int index = filePath.lastIndexOf('/');
                        String base = filePath.substring(0, index);
                        mediaFiles.add(base + '\\' + line);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading M3U file: " + e.getMessage());
        }
        updatePlaylist(mediaFiles.toArray(new String[0]));
    }

    /**
     * creates and updates playlist from folder
     * @param folderPath String containing path to folder
     */
    public void createPlaylistFromFolder(String folderPath) {
        List<File> localFilePlaylist = ReadDir.main("");

        if (localFilePlaylist == null || localFilePlaylist.isEmpty()) {
            System.err.println("No files found in the directory: " + folderPath);
            playlist = new String[0];  // Prevent null issues
            return;
        }

        String[] localPlaylist = new String[localFilePlaylist.size()];
        for (int i = 0; i < localFilePlaylist.size(); i++) {
            localPlaylist[i] = localFilePlaylist.get(i).getPath();
        }

        // Ensure MainPanel is fully initialized before calling update
        SwingUtilities.invokeLater(() -> updatePlaylist(localPlaylist));
    }
}
