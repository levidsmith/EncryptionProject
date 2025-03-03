/**
 * encrypt.js - 2025 Levi D. Smith
 */

function getBase64(strPlainText) {
  strCipherText = "";
//  console.log(strPlainText);
  console.log("Work in progress");

  j = 0;
  while (j + 3 < strPlainText.length) {
    var dec = strPlainText.charCodeAt(j + 0) * Math.pow(256, 2) + 
              strPlainText.charCodeAt(j + 1) * Math.pow(256, 1) + 
              strPlainText.charCodeAt(j + 2) * Math.pow(256, 0); 
    var octal = dec.toString(8);

    i = 0;
    while (i < 8) {
      o1 = octal.substring(i, i + 2);
      d1 = parseInt(o1, 8)
      strCipherText += base64Conv(parseInt(d1));
      i += 2;
    } 
 
    j += 3;
  }

  return strCipherText;

}

function base64Conv(iVal) {
  if (iVal >= 0 && iVal < 26) {
    return String.fromCharCode(65 + iVal);
  } else if (iVal < 52) {
    return String.fromCharCode(97 + iVal - 26);
  } else if (iVal < 62) {
    return String.fromCharCode(48 + iVal - 52);
  } else if (iVal == 62) {
    return "+";
  } else if (iVal == 63) {
    return "/";
  }
}

function makeUppercase(strPlainText) {
  strCipherText = "";
  for (const char of strPlainText) {
    c = char;

    //Set 6th bit to 0
    //0xDF = 1101 1111
    c1 = c.charCodeAt(0) & 0xDF ; //11011111

    strCipherText += String.fromCharCode(c1);
  }
  return strCipherText;
}

function caesarCipher(strPlainText, iShift) {
  strCipherText = "";

  iShift = iShift % 26;
  if (iShift < 0) {
    console.log("Invalid shift value");
    return;
  }

  for (const char of strPlainText) {
    c = char;
    iChar = c.charCodeAt(0);

    //first 5 bits (right to left) are the letter position
    //6th bit is the case (0 uppercase, 1 lowercase)
    //7th bit is always 1 for an ASCII letter
    //8th bit is always 0 for an ASCII letter

    //skip if not a valid letter (7th bit = 1, 8th bit = 0)
    if ( (iChar & 0xC0) != 0x40) {
      strCipherText += " ";
      continue;
    }

    //set bits 6,7,8 to 0  
    //0x1F = 0001 1111
    iLetterPosition = iChar & 0x1F;

    //skip if not a valid letter
    if (iLetterPosition > 26 || iLetterPosition < 1) {
      strCipherText += " ";
      continue;
    }

    //get the new letter position
    iNewLetterPosition = iLetterPosition + iShift;
    if (iNewLetterPosition > 26) {
      iNewLetterPosition = (iNewLetterPosition % 26);
    } 

    //Convert letter position back to ASCII character by setting 7th bit to 1
    //7th bit: 0x40 = 0100 0000
    //Set back to original case using the original 6th bit
    //6th bit: 0x20 = 0010 0000
    cCipher =  (iNewLetterPosition |  0x40) | (0x20 & iChar); 
     

    strCipherText += String.fromCharCode(cCipher);
  }

  return strCipherText;
}

function getLetterPosition(strPlainText) {
  strCipherText = "";

  for (const char of strPlainText) {
    c = char;
    iChar = c.charCodeAt(0);

    //first 5 bits (right to left) are the letter position
    //6th bit is the case (0 uppercase, 1 lowercase)
    //7th bit is always 1 for an ASCII letter
    //8th bit is always 0 for an ASCII letter

    //skip if not a valid letter (7th bit = 1, 8th bit = 0)
    if ( (iChar & 0xC0) != 0x40) {
      strCipherText += " ";
      continue;
    }

    //set bits 6,7,8 to 0  
    //0x1F = 0001 1111
    iLetterPosition = iChar & 0x1F;

    //skip if not a valid letter
    if (iLetterPosition > 26 || iLetterPosition < 1) {
      strCipherText += " ";
      continue;
    }

    if (strCipherText != "") {
      strCipherText += " ";
    }
    strCipherText += iLetterPosition; 
  }

  return strCipherText;
}

function getAsciiValue(strPlainText) {
  strCipherText = "";

  for (const char of strPlainText) {
    c = char;
    iChar = c.charCodeAt(0);

    if (strCipherText != "") {
      strCipherText += " ";
    }
    strCipherText += iChar;
  }

  return strCipherText;

}

function getColumnarTransposition(strPlainText, iColumns) {
  strCipherText = "";

  cipherArray = new Array();
  cipherArrayRow = new Array();

  i = 0;
  for (const char of strPlainText) {
    c = char;

    cipherArrayRow.push(c)

    i += 1;
    if (i >= iColumns) {
      cipherArray.push(cipherArrayRow);
      cipherArrayRow = new Array();
      i = 0;
    }
  }
  cipherArray.push(cipherArrayRow);

  for (j = 0; j < iColumns; j++) {
    for (i = 0; i < cipherArray.length; i++) {
      if(cipherArray[i].length > j) {
        strCipherText += cipherArray[i][j];
      }
    } 
  }

  return strCipherText;
}

function main() {
  args = process.argv;
  switch (args[2]) {
    case "upper":
      str = makeUppercase(args[3]);
      console.log(str);
      break;
    case "caesar":
      str = caesarCipher(args[3], args[4]);
      console.log(str);
      break;
    case "ascii":
      str = getAsciiValue(args[3]);
      console.log(str);
      break;
    case "letterposition":
      str = getLetterPosition(args[3]);
      console.log(str);
      break;
    case "columnartransposition":
      str = getColumnarTransposition(args[3], args[4]);
      console.log(str);
      break;
    case "base64":
      str = getBase64(args[3]);
      console.log(str);
      break;
    default:
      console.log("Invalid option");
      showUsage(); 
  }
}

function showUsage() {
  console.log("Usage:");
  console.log("node encrypt.js upper <text>");
  console.log("node encrypt.js caesar <text> <shift>");
  console.log("node encrypt.js ascii <text> ");
  console.log("node encrypt.js letterposition <text> ");
  console.log("node encrypt.js columnartransposition <text> ");
  console.log("node encrypt.js base64 <text> ");


}


//console.log(makeUppercase("aAHelloWorld"));
//console.log(caesarCipher("aAHello, WorldzZ!!", 1));
main();

