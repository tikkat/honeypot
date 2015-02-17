function start() {
  var template = {
    "client": [
      {
        "name": "apa",
        "description": "Your code for taking a step.",
        "parameters": [{"name": "first param", "type": "int"}, {"name": "second param", "type": "string"}],
        "returns": "bool"
      },
      {
        "name": "bepa",
        "description": "Your code for taking a step.",
        "parameters": [{"name": "first param", "type": "int"}, {"name": "second param", "type": "string"}]
      }
    ]
  };

  gen(template);
  genAPI(template);
}

function escape(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// GEN API

function genAPI(template) {
  template.client.forEach(function (method) {
    document.getElementById("output3").innerHTML += escape(genAPIMethodHead(method) + "{\n" + indent(genAPIMethodBody(method)) + "\n}");
  });
}

function genAPIMethodHead(method) {
  var methodParameters = method.parameters.map(function(param) {
      return getNativeType(param.type) + " " + camelCase(param.name);
    }
  ).join(", ");

  return "public static " + (method.returns !== undefined ? getNativeType(method.returns) : "void") + " " + camelCase(method.name) + "(" + methodParameters + ") ";
}

function genAPIMethodBody(method) {
  var methodParameters = method.parameters.map(function(param) {
      return toObject(param.type, camelCase(param.name));
    }
  ).join(", ");

  var body = "List<Object> params = Arrays.<Object>asList(" + methodParameters + ");\n";

  if (method.returns === undefined) {
    body += "ExampleJava.makeAsynchronousCall(\"" + camelCase(method.name) + "\", params);"
  } else {
    body += getNativeType(method.returns) + " result = " + castTo(method.returns, "ExampleJava.makeAsynchronousCall(\"" + camelCase(method.name) + "\", params)") + ";\n";
    body += "return result;";
  }

  return body;
}

// GEN API ENDS

// GEN IOCommunicator

function gen(template) {
  template.client.forEach(function (method) {
    document.getElementById("output").innerHTML += escape(genMethodHead(method) + "{\n" + indent(genMethodBody(method)) + "\n}");
    document.getElementById("output2").innerHTML += escape(genChooseMethod(method));
  });
}

function genChooseMethod(method) {
  return "case \"" + camelCase(method.name) + "\": " + camelCase(method.name) + "(call.id, call.params); break;\n";
}

function genMethodHead(method) {
  return "private static void " + camelCase(method.name) + "(int id, List<Object> params) ";
}

function genMethodBody(method) {
  var body = "";

  for (var i = 0; i < method.parameters.length; i++) {
    var param = method.parameters[i];
    body += getNativeType(param.type) + " " + camelCase(param.name) + " = " + castTo(param.type, "params.get(" + i + ")") + ";\n";
  }

  var methodCall = "solution." + method.name + "(" +
    method.parameters.map(function(param) {
      return camelCase(param.name);
    }
  ).join(", ") + ")";

  if (method.returns === undefined) {
    body += methodCall + ";";
  } else {
    body += getNativeType(method.returns) + " result = " + methodCall + ";\n"
    body += "String output = gson.toJson(new Result(id, " + toObject(method.returns, "result") + "));\n";
    body += "System.out.println(output);";
  }

  return body;
}

// GEN IOCOMMUNICATOR ENDS  ##

// UTILS

function camelCase(words) {
  words = words.split(" ");

  for (var i = 1; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }

  return words.join("");
}

function castTo(type, value) {
  switch (type) {
     case "bool":  return "((Boolean) " + value + ").booleanValue()";
     case "double":   return "((Double) " + value + ").doubleValue()";
     case "int":      return "((Double) " + value + ").intValue()";
     default:         return "(" + getNativeType(type) + ") " + value;
  }
}

function getNativeType(type) {
  switch (type) {
     case "string":   return "String";
     case "bool":   return "boolean";
     default:         return type;
  }
}

function toObject(type, value) {
  switch (type) {
    case "boolean":   return "Boolean.valueOf(" + value +")";
    case "int":       return "Integer.valueOf(" + value +")";
    case "double":    return "Double.valueOf(" + value +")";
    default:          return value;
  }
}

function indent(text) {
  return "    " + text.replace(/\n/g, "\n    ");
}

// UTILS ENDS
