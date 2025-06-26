package GUI.Buttons;

import Constants.ColorsScheme;
import java.awt.*;
import javax.swing.*;

import Utils.Playlist;
import Utils.StringOperations;

/**
 * button of playlist, click triggers playlist change
 */
public class PlaylistButton extends JButton{
    /**
     * button of playlist, click triggers playlist change
     * @param pathToPlaylist String containing path to playlist
     * @param pathToIcon String containing path to one of two playlist icons
     */
    public PlaylistButton(String pathToPlaylist, String pathToIcon) {
        ImageIcon originalIcon = new ImageIcon(pathToIcon); // Set your image path
        Image scaledImage = originalIcon.getImage().getScaledInstance(40, 40, Image.SCALE_SMOOTH);
        ImageIcon scaledIcon = new ImageIcon(scaledImage);
        super(StringOperations.nameFromPath(pathToPlaylist), scaledIcon);

        Font buttonFont = new Font("Fira Code Nerd Font", Font.PLAIN, 18);
        setFont(buttonFont);
        setSize(new Dimension(1380, 50));
        setMinimumSize(new Dimension(1380, 50));
        setForeground(ColorsScheme.TaupeGray);
        setHorizontalAlignment(SwingConstants.LEFT);
        setBackground(ColorsScheme.PrussianBlue);
        setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        setMargin(new Insets(5, 5, 5, 5));
        setFocusable(false);
        addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                setBackground(ColorsScheme.Charcoal);
            }

            @Override
            public void mouseExited(java.awt.event.MouseEvent evt) {
                setBackground(ColorsScheme.PrussianBlue);
            }
        });
        // Prevent Enter key from focusing the button
        getInputMap(JComponent.WHEN_FOCUSED).put(KeyStroke.getKeyStroke("ENTER"), "none");
        getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW).put(KeyStroke.getKeyStroke("ENTER"), "none");
        getActionMap().put("none", null);

        addActionListener(e -> {
            // Use the single player instance
            if (pathToPlaylist.contains("m3u")) {
                Playlist.getInstance().createPlaylistFromFile(pathToPlaylist);
            } else  {
                Playlist.getInstance().createPlaylistFromFolder(pathToPlaylist);
            }
        });
    }

    @Override
    public Dimension getPreferredSize() {
        return new Dimension(310, 50); // Set fixed width & height
    }

    @Override
    public Dimension getMinimumSize() {
        return new Dimension(310, 50); // Prevent shrinking
    }

    @Override
    public Dimension getMaximumSize() {
        return new Dimension(310, 50); // Prevent expanding
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
