package Utils;

import FileOperations.MetadataReader;
import GUI.Buttons.MusicProgress;

import GUI.MusicInfo;
import uk.co.caprica.vlcj.player.base.MediaPlayer;
import uk.co.caprica.vlcj.player.base.MediaPlayerEventAdapter;
import uk.co.caprica.vlcj.factory.MediaPlayerFactory;

import java.io.File;

/**
 * class responsible for playing music
 * must be one instance
 */
public class AudioFilePlayer {
    private static final AudioFilePlayer instance = new AudioFilePlayer();
    private final MediaPlayerFactory factory;
    private final MediaPlayer mediaPlayer;
    private String currentFilePath = null;
    private volatile boolean pauseRequested = false;
    private boolean autoPlayNext = true;
    private long totalTime = 0;

    /**
     * private constructor
     */
    private AudioFilePlayer() {
        factory = new MediaPlayerFactory();
        mediaPlayer = factory.mediaPlayers().newMediaPlayer();

        // Add event listeners
        mediaPlayer.events().addMediaPlayerEventListener(new MediaPlayerEventAdapter() {
            @Override
            public void lengthChanged(MediaPlayer mediaPlayer, long newLength) {
                totalTime = newLength;
            }

            @Override
            public void timeChanged(MediaPlayer mediaPlayer, long newTime) {
                updateProgress(newTime);
            }

            @Override
            public void finished(MediaPlayer mediaPlayer) {
                if (autoPlayNext) {
                    playNextFromPlaylist();
                }
            }

            @Override
            public void error(MediaPlayer mediaPlayer) {
                System.err.println("Error during media playback");
            }
        });
    }

    /**
     * returns instance of AudioFilePlayer
     * @return instance
     */
    // Get the single instance of the player
    public static AudioFilePlayer getInstance() {
        return instance;
    }

    /**
     * Enable or disable automatic playing of the next track
     * @param enable true to enable auto-play, false to disable
     */
    public void setAutoPlayNext(boolean enable) {
        autoPlayNext = enable;
    }

    /**
     * Check if autoplay next is enabled
     * @return true if autoplay next is enabled
     */
    public boolean isAutoPlayNextEnabled() {
        return autoPlayNext;
    }

    /**
     * Play an audio file from the beginning
     * @param filePath Path to the audio file
     */
    public synchronized void play(String filePath) {
        stopPlayback(); // Stop any current playback
        currentFilePath = filePath;

        File file = new File(filePath);
        if (!file.exists()) {
            System.err.println("File not found: " + filePath);
            return;
        }

        mediaPlayer.media().play(filePath);
        pauseRequested = false;
    }

    /**
     * Play from a specific position (in milliseconds)
     * @param position Position in milliseconds
     */
    public synchronized void playFromPosition(long position) {
        if (currentFilePath == null) {
            return;
        }

        if (mediaPlayer.status().isPlayable()) {
            mediaPlayer.controls().setTime(position);
            if (!mediaPlayer.status().isPlaying()) {
                mediaPlayer.controls().play();
            }
        } else {
            mediaPlayer.media().play(currentFilePath);
            mediaPlayer.controls().setTime(position);
        }
        pauseRequested = false;
    }

    /**
     * Update the progress bar based on current playback position
     * @param currentTime Current playback time in milliseconds
     */
    private void updateProgress(long currentTime) {
        if (totalTime > 0) {
            MusicProgress progress = MusicProgress.getInstance();
            int progressValue = (int)((currentTime * 300) / totalTime);
            progress.setProgress(Math.min(progressValue, 300));
        }
    }

    /**
     * Pause the current playback
     */
    public synchronized void pausePlayback() {
        if (isPlaying()) {
            mediaPlayer.controls().pause();
            pauseRequested = true;
        }
    }

    /**
     * Resume playback if paused
     */
    public synchronized void resumePlayback() {
        if (isPaused()) {
            mediaPlayer.controls().play();
            pauseRequested = false;
        }
    }

    /**
     * Toggle between play and pause states
     * @return true if now playing, false if now paused
     */
    public synchronized boolean togglePause() {
        if (isPaused()) {
            resumePlayback();
            return true;
        } else if (isPlaying()) {
            pausePlayback();
            return false;
        }
        return false;
    }

    /**
     * Stop the current playback
     */
    public synchronized void stopPlayback() {
        mediaPlayer.controls().stop();
        pauseRequested = false;
    }

    /**
     * Rewind to a specific progress position (0-300)
     * @param progress Progress value (0-300)
     */
    public synchronized void rewindToPosition(int progress) {
        if (currentFilePath == null || totalTime == 0) {
            return;
        }

        // Ensure progress is within valid range
        progress = Math.max(0, Math.min(progress, 300));

        // Calculate target time in milliseconds
        long targetTime = (progress * totalTime) / 300;
        playFromPosition(targetTime);
    }

    /**
     * Get current position in seconds
     * @return Current playback position in seconds
     */
    public double getCurrentPositionInSeconds() {
        return mediaPlayer.status().time() / 1000.0;
    }

    /**
     * Check if audio is currently playing
     * @return true if playing, false otherwise
     */
    public synchronized boolean isPlaying() {
        return mediaPlayer.status().isPlaying() && !pauseRequested;
    }

    /**
     * Check if audio is currently paused
     * @return true if paused, false otherwise
     */
    public synchronized boolean isPaused() {
        return mediaPlayer.status().canPause() && pauseRequested;
    }

    /**
     * Get the path of the currently playing file
     * @return Path of the current file
     */
    public String getCurrentFilePath() {
        return currentFilePath;
    }

    /**
     * Play the next song from the playlist
     */
    private void playNextFromPlaylist() {
        // Use a separate thread to avoid blocking
        new Thread(() -> {
            try {
                // Get the Playlist singleton instance
                Playlist playlist = Playlist.getInstance();

                // Move to the next song in the playlist
                playlist.next();

                // Play the current song from the playlist
                String nextSongPath = playlist.getSong();
                MusicInfo info = MusicInfo.getInstance();
                info.updateImage(nextSongPath);
                String[] metadata = MetadataReader.main(nextSongPath);
                if (metadata[0] == null) {
                    info.updateText(StringOperations.nameFromPath(nextSongPath));
                } else {
                    info.updateText(StringOperations.getMusicInfoTable(metadata));
                }
                play(nextSongPath);
            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("Error playing next song: " + e.getMessage());
            }
        }).start();
    }

    /**
     * Release all resources when application is closing
     */
    public void release() {
        mediaPlayer.release();
        factory.release();
    }
}