package GUI;
import Constants.*;
import java.awt.*;
import javax.swing.*;

/**
 * panel containing progress and currently played song info
 */
public class BottomPanel extends JPanel {
    private static final int SHADOW_SIZE = 2;
    private static final Color SHADOW_COLOR = ColorsScheme.DimGray;
    public BottomPanel() {
        setLayout(new FlowLayout());
        setPreferredSize(new Dimension(1920, 120));
        setMinimumSize(new Dimension(1920, 120));
        MusicInfo info = MusicInfo.getInstance();
        add(info, FlowLayout.LEFT);

        JPanel musicControls = new MusicControls();
        add(musicControls);
    }
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(ColorsScheme.Charcoal);
        g.fillRect(0, 0, getWidth(), getHeight());
        Graphics2D g2d = (Graphics2D) g.create();
        g2d.setColor(SHADOW_COLOR);

        // Draw top shadow
        g2d.fillRect(0, 0, getWidth(), SHADOW_SIZE);

        g2d.dispose();
    }

}