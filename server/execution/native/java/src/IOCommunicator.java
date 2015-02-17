import com.google.gson.Gson;
import java.util.List;
import java.util.Scanner;

public class IOCommunicator {
	private static Solution solution = new Solution();
	private static Gson gson = new Gson();
	private static Scanner in = new Scanner(System.in);
	private static int currentId = 0;

	public static void main(String[] args) {
		while (in.hasNextLine()) {
			handleInput(in.nextLine());
		}
	}

	private static void handleInput(String input) {
		Call call = gson.fromJson(input, Call.class);
		currentId = call.id + 1;
		receiveCall(call);
	}

	static Object makeSynchronousCall(String method, List<Object> params) {
		int id = currentId;
		makeAsynchronousCall(method, params);
		while (in.hasNextLine()) {
			String input = in.nextLine();
			if (gson.fromJson(input, Id.class).id == id) {
				return gson.fromJson(input, Result.class).result;
			} else {
				handleInput(input);
			}
		}
		throw new AssertionError("Reached end of input before result was received.");
	}

	
	static void makeAsynchronousCall(String method, List<Object> params) {
		System.out.println(gson.toJson(new Call(currentId, method, params)));
		currentId++;
	}

	private static void receiveCall(Call call) {
		switch (call.method) {
			// Generated code
			case "apa": apa(call.id, call.params); break;
			// End of generated code
		}
	}

	// Generated methods
	private static void apa(int id, List<Object> params) {
		int firstParam = ((Double) params.get(0)).intValue();
		String secondParam = (String) params.get(1);
		boolean result = solution.apa(firstParam, secondParam);
		String output = gson.toJson(new Result(id, Boolean.valueOf(result)));
		System.out.println(output);
	}

	// End of generated methods

	private static class Call {
		int id;
		String method;
		List<Object> params;

		public Call(int id, String method, List<Object> params) {
			this.id = id;
			this.method = method;
			this.params = params;
		}
	}

	private static class Result {
		int id;
		Object result;

		public Result() {
		}

		public Result(int id, Object result) {
			this.id = id;
			this.result = result;
		}
	}

	private static class Id {
		int id;
	}
}
