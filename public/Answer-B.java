import java.util.*;

public class Main {
    static int n, m;
    static char[][] grid;
    static boolean[][] visited;
    static int[] dr = {1, -1, 0, 0};
    static int[] dc = {0, 0, 1, -1};

    static boolean inside(int r, int c) {
        return r >= 0 && r < n && c >= 0 && c < m;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        m = sc.nextInt();
        grid = new char[n][m];
        for (int i = 0; i < n; i++) {
            String line = sc.next();
            grid[i] = line.toCharArray();
        }
        visited = new boolean[n][m];

        // Find all cable regions and count rod crossings
        int minSwitch = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 'C' && !visited[i][j]) {
                    minSwitch += bfs(i, j);
                }
            }
        }
        System.out.println(minSwitch);
    }

    static int bfs(int sr, int sc) {
        Queue<int[]> q = new LinkedList<>();
        q.add(new int[]{sr, sc});
        visited[sr][sc] = true;

        Set<String> rodsTouched = new HashSet<>();

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int r = cur[0], c = cur[1];
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (inside(nr, nc)) {
                    if (grid[nr][nc] == 'C' && !visited[nr][nc]) {
                        visited[nr][nc] = true;
                        q.add(new int[]{nr, nc});
                    } else if (grid[nr][nc] == 'R') {
                        rodsTouched.add(nr + "," + nc);
                    }
                }
            }
        }

 
        return rodsTouched.size() > 0 ? Math.max(0, rodsTouched.size() - 1) : 0;
    }
}
