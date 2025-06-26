package GUI.Buttons;

import Constants.ColorsScheme;
import Utils.AudioFilePlayer;

import javax.swing.*;
import java.awt.*;

/**
 * button responsible for stopping and resuming currently played song
 */
public class PlayStopButton extends JButton {  // Change to JButton to handle clicks
    public PlayStopButton() {
        setPreferredSize(new Dimension(50, 50));
        setBackground(ColorsScheme.PrussianBlue);
        setContentAreaFilled(false); // Ensures no default button rendering
        setFocusPainted(false); // Removes focus border
        setBorderPainted(false);
        addActionListener(e -> {
            AudioFilePlayer player = AudioFilePlayer.getInstance();
            player.togglePause();
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        if (getModel().isPressed()) {
            g2.setColor(getBackground().darker());
        } else {
            g2.setColor(getBackground());
        }

        g2.fillOval(0, 0, getWidth(), getHeight());

        Image image = new ImageIcon("src/main/resources/icons/play-stop.png").getImage();
        g2.drawImage(image, 10, 10, getWidth()-20, getHeight()-20, this);

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
