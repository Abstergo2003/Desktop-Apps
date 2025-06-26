package GUI;

import Constants.ColorsScheme;
import javax.swing.*;
import java.awt.*;

/**
 * panel displaying image
 */
public class ImagePanel extends JPanel {
    private Image image;
    private String imagePath;

    /**
     * default method of displaying image
     * @param path String containing path to image
     */
    public ImagePanel(String path) {
        setPreferredSize(new Dimension(100, 100));
        updateImage(path);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(ColorsScheme.Charcoal);
        g.fillRect(0, 0, getWidth(), getHeight());

        if (image != null) {
            g.drawImage(image, 0, 0, getWidth(), getHeight(), this);
        }
    }

    /**
     * sub method used to update image
     * @param path String containing path to image
     */
    public void updateImage(String path) {
        imagePath = path;
        image = new ImageIcon(imagePath).getImage();
        repaint();
    }
}