import java.util.Arrays;
import java.util.List;

public class API {

	// Generated methods
	public static boolean compare(int a, String b) {
		List<Object> params = Arrays.<Object>asList(Integer.valueOf(a), b);
		boolean result = ((Boolean) IOCommunicator.makeSynchronousCall("compare", params)).booleanValue();
		return result;
	}
	
	// End of generated methods

	private API() {
		throw new AssertionError();
	}
}
