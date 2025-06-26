package GUI;
import Constants.*;
import FileOperations.*;
import java.awt.*;
import javax.swing.*;
import javax.swing.plaf.basic.BasicScrollBarUI;

import GUI.Buttons.MusicButton;
import Utils.*;

/**
 * panel containing MusicButtons in scrollPane
 */
public class MainPanel extends JPanel {
    public static final MainPanel instance = new MainPanel();
    private static String[] selectedPlaylist;

    /**
     * panel containing MusicButtons in scrollPane
     * must be one instance
     */
    public MainPanel() {
        selectedPlaylist = Playlist.getInstance().getPlaylist();
        setPreferredSize(new Dimension(1600, 860));  // Set preferred size for the MainPanel
        setLayout(new BorderLayout());  // Use BorderLayout to control layout // Ensure the panel is opaque so the background is painted
        // Set background color for the panel
        setBackground(ColorsScheme.Charcoal);
        setBorder(BorderFactory.createEmptyBorder(10,55,10,0));
        JPanel wrapper = new JPanel();
        wrapper.setLayout(new BoxLayout(wrapper, BoxLayout.Y_AXIS)); // Add content in a vertical box// Get list of music files
        String[] music = selectedPlaylist;
        for (int i = 0; i < music.length; i++) {
            String song = music[i];
            String[] metadata = MetadataReader.main(song);
            Color buttonColor;
            if (i % 2 == 0) {
                buttonColor = ColorsScheme.PrussianBlue;
            } else {
                buttonColor = ColorsScheme.Charcoal;
            }

            MusicButton button = new MusicButton(metadata, buttonColor, song, i);
            wrapper.add(button);
        }
        // Set preferred height dynamically based on the number of items
        int wrapperHeight = music.length * 50; // 50px height for each song
        wrapper.setPreferredSize(new Dimension(1600, wrapperHeight)); // Dynamically adjust height
        wrapper.setBackground(ColorsScheme.Charcoal);
        // Scroll Pane configuration
        JScrollPane scrollPane = new JScrollPane(wrapper);
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        scrollPane.getVerticalScrollBar().setUnitIncrement(5); // Smooth scrolling
        scrollPane.getVerticalScrollBar().setPreferredSize(new Dimension(8, 0)); // Thin scrollbar
        scrollPane.getVerticalScrollBar().setUI(new CustomScrollBarUI()); // Custom scrollbar UI
        scrollPane.setBorder(BorderFactory.createEmptyBorder()); // Remove border from scrollPane

        add(scrollPane, BorderLayout.CENTER);  // Add the scrollPane to the center of MainPanel
    }

    /**
     * returns instance of MainPanel
     * @return instance
     */
    public static MainPanel getInstance() {
        return instance;
    }

    /**
     * repaints component when playlist gets updated
     * @param newPlaylist String[] containing paths to songs on playlist
     */
    public void playlistUpdate(String[] newPlaylist) {
        selectedPlaylist = newPlaylist;

        // Remove all components before updating
        removeAll();

        // Rebuild the UI with the updated playlist
        JPanel wrapper = new JPanel();
        wrapper.setLayout(new BoxLayout(wrapper, BoxLayout.Y_AXIS));

        for (int i = 0; i < selectedPlaylist.length; i++) {
            String song = selectedPlaylist[i];
            String[] metadata = MetadataReader.main(song);
            Color buttonColor = (i % 2 == 0) ? ColorsScheme.PrussianBlue : ColorsScheme.Charcoal;
            MusicButton button = new MusicButton(metadata, buttonColor, song, i);
            wrapper.add(button);
        }

        // Adjust wrapper size dynamically
        int wrapperHeight = selectedPlaylist.length * 50;
        wrapper.setPreferredSize(new Dimension(1600, wrapperHeight));
        wrapper.setBackground(ColorsScheme.Charcoal);

        // Recreate scroll pane
        JScrollPane scrollPane = new JScrollPane(wrapper);
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        scrollPane.getVerticalScrollBar().setUnitIncrement(5);
        scrollPane.getVerticalScrollBar().setPreferredSize(new Dimension(8, 0)); // Thin scrollbar
        scrollPane.getVerticalScrollBar().setUI(new CustomScrollBarUI());
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        // Add the updated scroll pane
        add(scrollPane, BorderLayout.CENTER);

        // Refresh UI
        revalidate(); // Recalculates layout
        repaint();    // Repaints the panel
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);  // Call the superclass method
        // Custom painting code here
        g.setColor(getBackground());  // Use the background color set with setBackground()
        g.fillRect(0, 0, getWidth(), getHeight());  // Fill the entire panel with the background color
    }

    /**
     * class containing custom scroll bar styling
     */
    // Custom scrollbar UI
    static class CustomScrollBarUI extends BasicScrollBarUI {
        @Override
        protected void configureScrollBarColors() {
            this.thumbColor = ColorsScheme.DimGray; // Thumb color
            this.trackColor = ColorsScheme.PrussianBlue; // Track color
        }

        @Override
        protected JButton createDecreaseButton(int orientation) {
            return createZeroButton(); // Hide the buttons
        }

        @Override
        protected JButton createIncreaseButton(int orientation) {
            return createZeroButton(); // Hide the buttons
        }

        private JButton createZeroButton() {
            JButton button = new JButton();
            button.setPreferredSize(new Dimension(0, 0)); // Hides buttons
            button.setMinimumSize(new Dimension(0, 0));
            button.setMaximumSize(new Dimension(0, 0));
            return button;
        }
    }
}
