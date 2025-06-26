package GUI;
import Constants.*;
import GUI.Buttons.PlaylistButton;

import java.awt.*;
import javax.swing.*;

/**
 * panel containing playlists buttons, located on the left of screen
 */
public class LeftPanel extends JPanel {
    public LeftPanel() {
        setPreferredSize(new Dimension(320, 860));
        setLayout(new FlowLayout());
        SavedSources sources = new SavedSources();
        String[] playlistSources = sources.getPlaylistSources();
        String[] folderSources = sources.getFolderSources();
        for (String folderSource : folderSources) {
            add(new PlaylistButton(folderSource, "src/main/resources/icons/folder.png"));
        }
        for (String playlistSource : playlistSources) {
            add(new PlaylistButton(playlistSource, "src/main/resources/icons/playlist.png"));
        }

        // Wrapper panel for the buttons
        
        // Add scrollPane to LeftPanel
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(ColorsScheme.PrussianBlue);
        g.fillRect(0, 0, getWidth(), getHeight());
    }

}
