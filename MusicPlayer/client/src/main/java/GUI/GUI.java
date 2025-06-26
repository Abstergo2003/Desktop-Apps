package GUI;
import FileOperations.ReadDir;
import Utils.Playlist;

import java.awt.*;
import java.io.File;
import java.util.List;
import javax.swing.*;

/**
 * main GUI class
 */
public class GUI{

    public GUI() {
        JFrame frame = new JFrame();
        LeftPanel NavPanel = new LeftPanel();

        BottomPanel ControlPanel = new BottomPanel();
        List<File> music = ReadDir.main(""); // Get list of music files
        Playlist playlist = Playlist.getInstance();
        String[] paths = new String[music.size()];
        for (int i = 0; i < music.size(); i++) {
            paths[i] = music.get(i).getPath();
        }
        playlist.updatePlaylist(paths);
        MainPanel MusicPanel = MainPanel.getInstance();
        frame.add(NavPanel, BorderLayout.LINE_START);
        frame.add(MusicPanel, BorderLayout.LINE_END);
        frame.add(ControlPanel, BorderLayout.AFTER_LAST_LINE);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setTitle("MusicPlayer");
        frame.pack();
        frame.setVisible(true);
    }
}
