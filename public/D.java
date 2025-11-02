import java.util.*;

public class Main {
    static int E;
    static ArrayList<int[]> edgesG = new ArrayList<>();
    static ArrayList<int[]> edgesH = new ArrayList<>();
    static Map<Integer,Integer> nodeToIdx = new HashMap<>();
    static List<Integer> idxToNode = new ArrayList<>();
    static boolean[][] adjG, adjH;
    static int n; // number of nodes

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        E = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < E; i++) {
            String[] t = readEdgeLine(sc);
            int a = Integer.parseInt(t[0]), b = Integer.parseInt(t[1]);
            edgesG.add(new int[]{a,b});
            addNode(a); addNode(b);
        }
        for (int i = 0; i < E; i++) {
            String[] t = readEdgeLine(sc);
            int a = Integer.parseInt(t[0]), b = Integer.parseInt(t[1]);
            edgesH.add(new int[]{a,b});
            addNode(a); addNode(b);
        }

        // build index mapping
        Collections.sort(idxToNode);
        nodeToIdx.clear();
        for (int i = 0; i < idxToNode.size(); i++) nodeToIdx.put(idxToNode.get(i), i);
        n = idxToNode.size();
        // adjacency
        adjG = new boolean[n][n];
        adjH = new boolean[n][n];
        for (int[] e : edgesG) {
            int u = nodeToIdx.get(e[0]), v = nodeToIdx.get(e[1]);
            adjG[u][v] = adjG[v][u] = true;
        }
        for (int[] e : edgesH) {
            int u = nodeToIdx.get(e[0]), v = nodeToIdx.get(e[1]);
            adjH[u][v] = adjH[v][u] = true;
        }

        // enumerate simple cycles in G
        List<int[]> cyclePerms = getAllCyclePermutations();

        // find all isomorphisms p : nodes -> nodes such that adjG mapped equals adjH
        List<int[]> validMappings = new ArrayList<>();
        findIsomorphisms(validMappings);

        if (validMappings.isEmpty()) {
            System.out.println(-1);
            return;
        }

        int ans = Integer.MAX_VALUE;
        for (int[] p : validMappings) {
            int steps = bfsMinStepsToTarget(p, cyclePerms);
            if (steps >= 0) ans = Math.min(ans, steps);
        }
        System.out.println(ans == Integer.MAX_VALUE ? -1 : ans);
    }

    static String[] readEdgeLine(Scanner sc) {
        String line = sc.nextLine().trim();
        while (line.length() == 0) line = sc.nextLine().trim();
        String[] parts = line.split("\\s+");
        return parts;
    }

    static void addNode(int x) {
        if (!nodeToIdx.containsKey(x) && !idxToNode.contains(x)) idxToNode.add(x);
    }

    // produce all simple cycles (undirected) and convert each into a cyclic permutation array
    static List<int[]> getAllCyclePermutations() {
        List<int[]> perms = new ArrayList<>();
        // DFS from each start ensuring start is minimal in cycle to avoid duplicates
        boolean[] used = new boolean[n];
        for (int start = 0; start < n; start++) {
            Deque<Integer> stack = new ArrayDeque<>();
            boolean[] visited = new boolean[n];
            visited[start] = true;
            stack.push(start);
            dfsCycles(start, start, visited, stack, perms);
            visited[start] = false;
        }
        return perms;
    }

    static void dfsCycles(int start, int u, boolean[] visited, Deque<Integer> stack, List<int[]> perms) {
        for (int v = 0; v < n; v++) {
            if (!adjG[u][v]) continue;
            if (v == start && stack.size() >= 3) {
                // record cycle from stack (stack contains nodes from start..u)
                List<Integer> cycle = new ArrayList<>(stack);
                Collections.reverse(cycle); // stack top -> start, reverse to start->...
                // canonicalize: rotate so smallest index comes first
                int k = cycle.size();
                int minIdx = 0;
                for (int i = 1; i < k; i++)
                    if (cycle.get(i) < cycle.get(minIdx)) minIdx = i;
                int[] cyc = new int[k];
                for (int i = 0; i < k; i++) cyc[i] = cycle.get((minIdx + i) % k);
                // store both directions as permutations if not duplicate
                addCyclePermIfNew(cyc, perms);
                int[] rev = new int[k];
                for (int i = 0; i < k; i++) rev[i] = cyc[(k - i) % k]; // reversed order rotated
                addCyclePermIfNew(rev, perms);
            } else if (!visited[v] && v > start) {
                visited[v] = true;
                stack.push(v);
                dfsCycles(start, v, visited, stack, perms);
                stack.pop();
                visited[v] = false;
            }
        }
    }

    static void addCyclePermIfNew(int[] cycle, List<int[]> perms) {
        // create permutation array from cycle: cycle[i] -> cycle[(i+1)%k]
        int k = cycle.length;
        int[] perm = identityPerm(n);
        for (int i = 0; i < k; i++) perm[ cycle[i] ] = cycle[(i+1)%k];
        // check uniqueness (by string)
        String s = Arrays.toString(perm);
        for (int[] p: perms) if (Arrays.toString(p).equals(s)) return;
        perms.add(perm);
    }

    static int[] identityPerm(int n) {
        int[] id = new int[n];
        for (int i = 0; i < n; i++) id[i] = i;
        return id;
    }

    // find all mappings p (permutations) with backtracking that map G->H
    static void findIsomorphisms(List<int[]> valid) {
        int[] map = new int[n]; Arrays.fill(map, -1);
        boolean[] used = new boolean[n];
        // quick degree multiset check: for pruning
        int[] degG = new int[n], degH = new int[n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                if (adjG[i][j]) degG[i]++;
                if (adjH[i][j]) degH[i]++;
            }
        // bucket by degree possible matches
        ArrayList<Integer>[] candidates = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            candidates[i] = new ArrayList<>();
            for (int j = 0; j < n; j++) if (degG[i] == degH[j]) candidates[i].add(j);
        }
        backtrackMap(0, map, used, candidates, valid);
    }

    static void backtrackMap(int idx, int[] map, boolean[] used, ArrayList<Integer>[] cand, List<int[]> valid) {
        if (idx == n) {
            // validate full mapping (should hold by incremental checks but verify)
            valid.add(map.clone());
            return;
        }
        // pick next unassigned node with smallest candidate size (heuristic)
        int pick = -1, best = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) if (map[i] == -1) {
            if (cand[i].size() < best) { best = cand[i].size(); pick = i; }
        }
        if (pick == -1) return;
        for (int target : cand[pick]) {
            if (used[target]) continue;
            // provisional check with already assigned nodes: edges among assigned must match
            boolean ok = true;
            for (int u = 0; u < n && ok; u++) {
                if (map[u] == -1) continue;
                boolean e1 = adjG[pick][u];
                boolean e2 = adjH[target][map[u]];
                if (e1 != e2) ok = false;
            }
            if (!ok) continue;
            map[pick] = target;
            used[target] = true;
            backtrackMap(idx+1, map, used, cand, valid);
            map[pick] = -1;
            used[target] = false;
        }
    }

    // BFS from identity to target permutation, moves are left-multiplying by cycle permutations
    static int bfsMinStepsToTarget(int[] target, List<int[]> cyclePerms) {
        String targetStr = Arrays.toString(target);
        String idStr = Arrays.toString(identityPerm(n));
        if (idStr.equals(targetStr)) return 0;
        Queue<String> q = new LinkedList<>();
        Map<String, Integer> dist = new HashMap<>();
        q.add(idStr);
        dist.put(idStr, 0);
        while (!q.isEmpty()) {
            String cur = q.poll();
            int[] curPerm = parsePerm(cur);
            int d = dist.get(cur);
            for (int[] cycle : cyclePerms) {
                int[] composed = compose(cycle, curPerm); // new = cycle ∘ cur
                String s = Arrays.toString(composed);
                if (!dist.containsKey(s)) {
                    if (s.equals(targetStr)) return d+1;
                    dist.put(s, d+1);
                    q.add(s);
                }
            }
        }
        return -1;
    }

    static int[] parsePerm(String s) {
        s = s.substring(1, s.length()-1);
        String[] parts = s.split(",\\s*");
        int[] a = new int[parts.length];
        for (int i = 0; i < parts.length; i++) a[i] = Integer.parseInt(parts[i]);
        return a;
    }

    // compose: res = a ∘ b  (apply b then a). Here we represent permutations as arrays: p[i] = image of i
    static int[] compose(int[] a, int[] b) {
        int[] r = new int[n];
        for (int i = 0; i < n; i++) r[i] = a[ b[i] ];
        return r;
    }
}
