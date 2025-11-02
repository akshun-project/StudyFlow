import java.util.*;

public class Main {
    static int minOperations(List<String> shuffled, List<String> original) {
        int n = shuffled.size();
        Map<String, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < n; i++) indexMap.put(original.get(i), i);

        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = indexMap.get(shuffled.get(i));

        int[] target = new int[n];
        for (int i = 0; i < n; i++) target[i] = i;

        if (Arrays.equals(arr, target)) return 0;

        // Try all contiguous subarrays as movable segments
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                List<Integer> remaining = new ArrayList<>();
                List<Integer> segment = new ArrayList<>();
                for (int k = 0; k < n; k++) {
                    if (k >= i && k <= j) segment.add(arr[k]);
                    else remaining.add(arr[k]);
                }
                for (int k = 0; k <= remaining.size(); k++) {
                    List<Integer> newArr = new ArrayList<>(remaining.subList(0, k));
                    newArr.addAll(segment);
                    newArr.addAll(remaining.subList(k, remaining.size()));
                    boolean ok = true;
                    for (int t = 0; t < n; t++) {
                        if (newArr.get(t) != target[t]) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok) return 1;
                }
            }
        }
        return 2; // At most 2 moves needed
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        sc.nextLine(); // skip "shuffled"
        List<String> shuffled = new ArrayList<>();
        for (int i = 0; i < n; i++) shuffled.add(sc.nextLine().trim());
        sc.nextLine(); // skip "original"
        List<String> original = new ArrayList<>();
        for (int i = 0; i < n; i++) original.add(sc.nextLine().trim());
        System.out.println(minOperations(shuffled, original));
    }
}
