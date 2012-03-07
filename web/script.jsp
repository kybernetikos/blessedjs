<%@ page import="java.io.*,java.util.*" contentType="application/javascript" %><%! 
	private static byte[] buffer = new byte[1024];
	private static int bytesRead = 0;
	private static void appendFile(File file, HttpServletResponse response) throws IOException {
		if (file.exists() == false) return;
		FileInputStream fr = new FileInputStream(file);
		response.getOutputStream().println("// "+file.getName());
		while((bytesRead = fr.read(buffer)) >= 0) {
			response.getOutputStream().write(buffer, 0, bytesRead);
		}
		response.getOutputStream().write("\n".getBytes());
		fr.close();
	}
	private static List<String> PRELUDE_FILE_NAMES = Arrays.asList(new String[] {"utils.js"});
	private static List<String> AFTERWORD_FILE_NAMES = Arrays.asList(new String[] {"main.js"});
	private static void include(File file, HttpServletResponse response) throws IOException {
		if (file.isDirectory()) {
			for (String prelude : PRELUDE_FILE_NAMES) {
				appendFile(new File(file, prelude), response);
			}
			String moduleName = file.getName()+".js";
			File module = new File(file, moduleName);
			appendFile(module, response);
			File[] contents = file.listFiles();
			for (File includeFile : contents) {
				String fileName = includeFile.getName().toLowerCase();
				if (includeFile.isDirectory() || (fileName.endsWith(".js") && fileName.equalsIgnoreCase(moduleName) == false && PRELUDE_FILE_NAMES.indexOf(fileName) < 0 && AFTERWORD_FILE_NAMES.indexOf(fileName) < 0)) {
					include(includeFile, response);
				}
			}
			for (String appendix : AFTERWORD_FILE_NAMES) {
				appendFile(new File(file, appendix), response);
			}
		} else {
			appendFile(file, response);
		}
	}
%><%
	ServletContext context = session.getServletContext();
	File srcDir = new File(context.getRealPath(request.getServletPath()+"/../js/src"));
	include(srcDir, response);
%>