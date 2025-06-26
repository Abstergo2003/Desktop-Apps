package Utils;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * class containing useful methods related to string
 */
public class StringOperations {
    /**
     * cuts string after set number pf characters
     * @param base base String
     * @param length int with length
     * @return cut string
     */
    public static String setFixedLength(String base, int length) {
        String edited;
        if (base == null) {
            return "";
        }
        if (base.length() > length) {
            edited = base.substring(0, length);
            return edited;
        }
        edited = base;
        return edited;
    }

    /**
     * creates html table for info
     * @param metadata String[] with metadata
     * @return html table as String
     */
    public static String getMusicInfoTable(String[] metadata) {
        String title = StringOperations.setFixedLength(metadata[0], 20);
        String artist = StringOperations.setFixedLength(metadata[1], 30);
        return "<html>"
                + String.format("<font size='6'><b>%s</b></font>", title)
                +"<br>"
                +String.format("<span>%s</span>", artist)
                +"</html>";
    }

    /**
     * creates html table for MusicButton containing all metadata
     * @param metadata String[6] with metadata: title, artist, album, year, genre, parsedLength,
     * @return html table as String
     */
    public static String getNamesTable(String[] metadata) {
        String title = StringOperations.setFixedLength(metadata[0], 42);
        String artist = StringOperations.setFixedLength(metadata[1], 24);
        String album = StringOperations.setFixedLength(metadata[2], 24);
        String year = StringOperations.setFixedLength(metadata[3], 24);
        return "<html>"
                + "<table width='1380'>" // Set total width
                + "<tr>"
                + String.format("<td width='508'><b>%s</b></td>", title)
                + String.format("<td width='280'>%s</td>", artist)
                + String.format("<td width='280'>%s</td>", album)
                + String.format("<td width='230'>%s</td>", year)
                + String.format("<td width='50'>%s</td>", metadata[5])
                + "</tr>"
                + "</table>"
                + "</html>";
    }

    /**
     * parses time to format hh:mm:ss or mm:ss
     * @param time double time ins seconds
     * @return String with time in format hh:mm:ss or mm:ss
     */
    public static String parseTime(double time) {
        double hours = Math.floor((double) time /3600);
        double reduced = time - hours*3600;
        double minutes = Math.floor((double) reduced/60);
        double seconds = time - minutes*60;
        String hoursS, minutesS, secondsS;
        if (hours < 10) {
            hoursS = String.format("0%s",(int) hours);
        } else {
            hoursS = String.format("%s",(int) hours);
        }
        if (minutes < 10) {
            minutesS = String.format("0%s",(int) minutes);
        } else {
            minutesS = String.format("%s",(int) minutes);
        }
        if (seconds < 10) {
            secondsS = String.format("0%s",(int) seconds);
        } else {
            secondsS = String.format("%s",(int) seconds);
        }
        if (hours > 0) {
            return String.format("%s:%s:%s", hoursS, minutesS, secondsS);
        } else {
            return String.format("%s:%s", minutesS, secondsS);
        }
    }

    /**
     * gets file name from String with path (without ext)
     * @param filePath String with path to file
     * @return name of file at specified path
     */
    public static String nameFromPath(String filePath) {
        Path path = Paths.get(filePath);
        String fileName = path.getFileName().toString();
        int lastDotIndex = fileName.lastIndexOf(".");
        return (lastDotIndex == -1) ? fileName : fileName.substring(0, lastDotIndex);
    }
}
