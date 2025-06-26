package GUI.Buttons;

import Constants.ColorsScheme;
import Utils.AudioFilePlayer;

import javax.swing.*;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.plaf.basic.BasicSliderUI;
import java.awt.*;

/**
 * slider used to indicate and change progress of currently playing song
 * important to create only one instance
 */
public class MusicProgress extends JSlider {
    private static final MusicProgress instance = new MusicProgress();
    private boolean isUpdating = false; // Prevents triggering change listener during auto-updates
    private boolean userDragging = false; // Track if the user is dragging the slider

    public MusicProgress() {
        setMinimum(0);
        setMaximum(300);
        setValue(0);
        setPreferredSize(new Dimension(1480, 20));
        setUI(new CustomSliderUI(this));
        setBackground(ColorsScheme.Charcoal);
        setPaintTrack(true);
        setPaintTicks(false);
        setPaintLabels(false);

        // Add Change Listener to detect user interaction
        addChangeListener(new ChangeListener() {
            @Override
            public void stateChanged(ChangeEvent e) {
                if (isUpdating) return; // Ignore updates triggered by setProgress()

                if (getValueIsAdjusting()) {
                    userDragging = true; // User is dragging the slider
                } else {
                    userDragging = false; // Dragging stopped, update playback position
                    int value = getValue();
                    AudioFilePlayer.getInstance().rewindToPosition(value);
                }
            }
        });
    }

    /**
     * returns instance
     * @return instance of MusicProgress
     */
    public static MusicProgress getInstance() {
        return instance;
    }

    /**
     * Updates progress without triggering change events.
     * Called from the music player to update the slider position.
     * @param progress in range from 0 to 300
     */
    public void setProgress(int progress) {
        if (userDragging) return; // Don't update if the user is dragging the slider

        isUpdating = true; // Prevent listener from triggering seek
        setValue(progress);
        isUpdating = false; // Re-enable listener

        if (SwingUtilities.isEventDispatchThread()) {
            repaint();
        } else {
            SwingUtilities.invokeLater(this::repaint);
        }
    }

    /**
     * graphic methode to change appearance
     */
    private static class CustomSliderUI extends BasicSliderUI {
        public CustomSliderUI(JSlider slider) {
            super(slider);
        }

        @Override
        public void paintTrack(Graphics g) {
            Graphics2D g2d = (Graphics2D) g;
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // Track colors
            g2d.setColor(new Color(100, 100, 100)); // Inactive track (gray)
            g2d.fillRoundRect(trackRect.x, trackRect.y + trackRect.height / 2 - 2, trackRect.width, 4, 10, 10);

            g2d.setColor(ColorsScheme.PrimaryOrange); // Active track (red-orange)
            int filledWidth = thumbRect.x - trackRect.x + thumbRect.width / 2;
            g2d.fillRoundRect(trackRect.x, trackRect.y + trackRect.height / 2 - 2, filledWidth, 4, 10, 10);
        }

        @Override
        public void paintThumb(Graphics g) {
            Graphics2D g2d = (Graphics2D) g;
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // Circular thumb
            int thumbSize = 16;
            int x = thumbRect.x + (thumbRect.width - thumbSize) / 2;
            int y = thumbRect.y + (thumbRect.height - thumbSize) / 2;

            g2d.setColor(ColorsScheme.PrimaryOrange); // Thumb color (red-orange)
            g2d.fillOval(x, y, thumbSize, thumbSize);

            g2d.setColor(Color.WHITE); // Border around the thumb
            g2d.drawOval(x, y, thumbSize, thumbSize);
        }

        @Override
        public void paintFocus(Graphics g) {
            // No focus painting (remove default ugly focus border)
        }
    }
}

