package FileOperations;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class ReadDir {
    /**
     * main method, reads directory and returns all .mp3 files
     * @param args not used, always pass ""
     * @return mp3Files as List<File>
     */
    public static List<File> main(String args) {
        File folder = new File("src/main/resources/music"); // Change to your folder
        List<File> mp3Files = new ArrayList<>();
        searchMp3Files(folder, mp3Files);
        return mp3Files;
    }

    /**
     * sub method from folder picks .mp3 and .wav files and mutates passed List<File>
     * @param folder folder as File type to search for desired files
     * @param mp3Files List<File> to mutate
     */
    public static void searchMp3Files(File folder, List<File> mp3Files) {
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    searchMp3Files(file, mp3Files); // Recursive search
                } else if (file.getName().toLowerCase().endsWith(".mp3") || file.getName().toLowerCase().endsWith(".wav")) {
                    mp3Files.add(file);
                }
            }
        }
    }

    /**
     * sub method checks if file exists
     * @param path String containing path to file
     * @return Boolean true if exists, false if it doesn't
     */
    public static boolean fileExists(String path) {
        File file = new File(path);
        return file.exists();
    }
}
