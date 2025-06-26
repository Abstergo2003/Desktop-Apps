package GUI.Buttons;

import Constants.ColorsScheme;
import FileOperations.MetadataReader;
import GUI.MusicInfo;
import Utils.AudioFilePlayer;
import Utils.Playlist;
import Utils.StringOperations;

import javax.swing.*;
import java.awt.*;

/**
 * button jumping to next song on playlist
 */
public class ForwardButton extends JButton {  // Change to JButton to handle clicks
    public ForwardButton() {
        setPreferredSize(new Dimension(50, 50));
        setBackground(ColorsScheme.PrussianBlue);
        setContentAreaFilled(false); // Ensures no default button rendering
        setFocusPainted(false); // Removes focus border
        setBorderPainted(false);
        addActionListener(e -> {
            Playlist playlist = Playlist.getInstance();
            playlist.next();
            String path = playlist.getSong();
            AudioFilePlayer player = AudioFilePlayer.getInstance();
            MusicInfo info = MusicInfo.getInstance();
            info.updateImage(path);
            String[] metadata = MetadataReader.main(path);
            if (metadata[0] == null) {
                System.out.print(StringOperations.nameFromPath(path));
                info.updateText(StringOperations.setFixedLength(StringOperations.nameFromPath(path), 35));
            } else {
                info.updateText(StringOperations.getMusicInfoTable(metadata));
            }
            player.stopPlayback();  // Stop the current playback
            player.play(path);  // Play the new track
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Zmiana koloru po kliknięciu
        if (getModel().isPressed()) {
            g2.setColor(getBackground().darker()); // Zmiana koloru po kliknięciu
        } else {
            g2.setColor(getBackground());
        }

        g2.fillOval(0, 0, getWidth(), getHeight());

        // Wczytanie i rysowanie ikony
        Image image = new ImageIcon("src/main/resources/icons/arrows_circle_left.png").getImage();
        g2.drawImage(image, 0, 0, getWidth(), getHeight(), this);

        g2.dispose();
    }

    @Override
    protected void paintBorder(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Set border color
        g2.setColor(ColorsScheme.PrimaryOrange);
        g2.drawOval(0, 0, getWidth() - 1, getHeight() - 1);

        g2.dispose();
    }
}
