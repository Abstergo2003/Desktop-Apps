package GUI.Buttons;

import Constants.ColorsScheme;
import java.awt.*;
import javax.swing.*;

import GUI.MusicInfo;
import Utils.AudioFilePlayer;
import Utils.Playlist;
import Utils.StringOperations;

/**
 * button responsible for choosing song to play, displays all info about song
 */
public class MusicButton extends JButton {
    public MusicButton(String[] metadata, Color color, String musicPath, int index) {
        String buttonText;
        if (metadata[0] == null) {
            buttonText = StringOperations.nameFromPath(musicPath);
        } else {
            buttonText = StringOperations.getNamesTable(metadata);
        }
        super(buttonText);

        Font buttonFont = new Font("Fira Code Nerd Font", Font.PLAIN, 18);
        setFont(buttonFont);
        setSize(new Dimension(1380, 50));
        setMinimumSize(new Dimension(1380, 50));
        setForeground(ColorsScheme.TaupeGray);
        setHorizontalAlignment(SwingConstants.LEFT);
        setBackground(color);
        setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        setMargin(new Insets(5, 5, 5, 5));
        setFocusable(false);

        // Prevent Enter key from focusing the button
        getInputMap(JComponent.WHEN_FOCUSED).put(KeyStroke.getKeyStroke("ENTER"), "none");
        getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW).put(KeyStroke.getKeyStroke("ENTER"), "none");
        getActionMap().put("none", null);

        addActionListener(e -> {
            // Use the single player instance
            Playlist playlist = Playlist.getInstance();
            playlist.jumpTo(index);
            AudioFilePlayer player = AudioFilePlayer.getInstance();
            MusicInfo info = MusicInfo.getInstance();
            info.updateImage(musicPath);
            if (metadata[0] == null) {
                info.updateText(StringOperations.setFixedLength(StringOperations.nameFromPath(musicPath), 35));
            } else {
                info.updateText(StringOperations.getMusicInfoTable(metadata));
            }
            player.stopPlayback();  // Stop the current playback
            player.play(musicPath);  // Play the new track
        });
    }

    @Override
    public Dimension getPreferredSize() {
        return new Dimension(1490, 50); // Set fixed width & height
    }

    @Override
    public Dimension getMinimumSize() {
        return new Dimension(1490, 50); // Prevent shrinking
    }

    @Override
    public Dimension getMaximumSize() {
        return new Dimension(1490, 50); // Prevent expanding
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Set the button color
        if (getModel().isPressed()) {
            g2.setColor(getBackground().darker()); // Darken when pressed
        } else {
            g2.setColor(getBackground());
        }

        // Fill a rounded rectangle
        g2.fillRoundRect(0, 0, getWidth(), getHeight(), 15, 15);

        g2.dispose(); // Dispose of Graphics2D

        // Ensure transparency
        setOpaque(false);
        setContentAreaFilled(false);

        // **Manually draw text and icon**
        super.paintComponent(g);
    }
}
