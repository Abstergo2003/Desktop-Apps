package GUI;

import Constants.ColorsScheme;
import GUI.Buttons.BackButton;
import GUI.Buttons.ForwardButton;
import GUI.Buttons.MusicProgress;
import GUI.Buttons.PlayStopButton;

import javax.swing.*;
import java.awt.*;

/**
 * component containing progress, and control buttons
 */
public class MusicControls extends JPanel {
    private static final MusicControls instance = new MusicControls();
    public MusicControls() {
        setBackground(ColorsScheme.Charcoal);
        setPreferredSize(new Dimension(1510,120));
        MusicProgress time = MusicProgress.getInstance();
        add(time);
        add(new BackButton());
        add(new PlayStopButton());
        add(new ForwardButton());

    }
}
