import java.util.*;

public class Main {
    static class Slide {
        int x1, y1, x2, y2, dx, dy;
        Slide(int a, int b, int c, int d) {
            x1 = a; y1 = b; x2 = c; y2 = d;
            dx = (x2 > x1 ? 1 : -1);
            dy = (y2 > y1 ? 1 : -1);
        }
        boolean onSlide(int x, int y) {
            return (x - x1) * (y2 - y1) == (y - y1) * (x2 - x1)
                   && Math.min(x1, x2) <= x && x <= Math.max(x1, x2)
                   && Math.min(y1, y2) <= y && y <= Math.max(y1, y2);
        }
    }

    static List<Slide> slides = new ArrayList<>();
    static int x, y, e;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++)
            slides.add(new Slide(sc.nextInt(), sc.nextInt(), sc.nextInt(), sc.nextInt()));
        x = sc.nextInt();
        y = sc.nextInt();
        e = sc.nextInt();

        while (true) {
            // fall down
            int ny = fall(x, y);
            if (ny == 0) { y = 0; break; }
            y = ny;

            // find slide under this point
            Slide s = findSlide(x, y);
            if (s == null) break;

            // slide
            while (e > 0 && s.onSlide(x, y) && y > 0) {
                x += s.dx;
                y += s.dy;
                e--;
                // check intersection (stuck point)
                if (countSlidesAt(x, y) > 1 && e >= x * y) {
                    e -= x * y; // unlock
                }
                if (y <= 0) { y = 0; break; }
            }

            if (e <= 0 || y == 0) break;
        }
        System.out.println(x + " " + y);
    }

    static int fall(int cx, int cy) {
        for (int ny = cy - 1; ny >= 0; ny--) {
            if (findSlide(cx, ny) != null)
                return ny;
        }
        return 0;
    }

    static Slide findSlide(int cx, int cy) {
        for (Slide s : slides)
            if (s.onSlide(cx, cy))
                return s;
        return null;
    }

    static int countSlidesAt(int cx, int cy) {
        int c = 0;
        for (Slide s : slides)
            if (s.onSlide(cx, cy))
                c++;
        return c;
    }
}
