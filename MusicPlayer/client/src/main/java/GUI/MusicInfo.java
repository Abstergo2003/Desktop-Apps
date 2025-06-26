package GUI;

import Constants.ColorsScheme;
import FileOperations.ReadDir;

import javax.swing.*;
import java.awt.*;

/**
 * component containing image and other info about currently playing song
 */
public class MusicInfo extends JPanel {
    private static MusicInfo instance;
    private final ImagePanel imagePanel;
    private final JLabel title;

    /**
     * component containing image and other info about currently playing song
     * must be one instance
     */
    private MusicInfo() {
        setBackground(ColorsScheme.Charcoal);
        setPreferredSize(new Dimension(400, 120));
        setLayout(new FlowLayout(FlowLayout.LEFT));

        title = new JLabel("");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("Fira Code Nerd Font", Font.PLAIN, 18));
        add(title);

        imagePanel = new ImagePanel("src/main/resources/icons/note.png");
        add(imagePanel, FlowLayout.LEFT);

    }

    /**
     * returns instance of MusicInfo
     * @return instance
     */
    public static synchronized MusicInfo getInstance() {
        if (instance == null) {
            instance = new MusicInfo();
        }
        return instance;
    }

    /**
     * updates image displayed
     * @param path String containing path to image
     */
    public void updateImage(String path) {
        String folderIcon = path.replace(".mp3", ".jpeg").replace(".wav", "jpeg");
        if (ReadDir.fileExists(folderIcon)) {
            imagePanel.updateImage(folderIcon);
        } else {
            imagePanel.updateImage("src/main/resources/icons/note.png");
        }
    }

    /**
     * updates text displayed
     * @param text String containing either raw text or html table
     */
    public void updateText(String text) {
        title.setText(text);
        revalidate();
        repaint();
    }
}
