package FileOperations;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import java.io.File;
import Utils.*;

/**
 * Class responsible for reading metadata of mp3 file
 */
public class MetadataReader {

    /**
     * main method of reading metadata
     * @param path String of path to containing .mp3 file
     * @return outcome metadata of mp3 file as String[6] = {title, artist, album, year, genre, parsedLength}
     */
    public static String[] main(String path) {
        String[] outcome = new String[6];
        try {
            // Load the MP3 file
            File file = new File(path);
            MP3File mp3File = (MP3File) AudioFileIO.read(file);
            int length = mp3File.getAudioHeader().getTrackLength();
            Tag tag = mp3File.getTag();

            // Extract metadata
            outcome[0] = tag.getFirst(FieldKey.TITLE);
            outcome[1] = tag.getFirst(FieldKey.ARTIST);
            outcome[2] = tag.getFirst(FieldKey.ALBUM);
            outcome[3] = tag.getFirst(FieldKey.YEAR);
            outcome[4] = tag.getFirst(FieldKey.GENRE);
            outcome[5] = StringOperations.parseTime(length);
            return outcome;
        } catch (Exception e) {
            return new String[6];
        }
    }
}
