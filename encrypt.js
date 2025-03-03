/**
 * encrypt.js - 2025 Levi D. Smith
 */

function base64Encode(strPlainText) {
  console.log(strPlainText);
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
  for (const char of strPlainText) {
    c = char;
    iChar = c.charCodeAt(0);

    //first 5 bits (right to left) are the letter position
    //6th bit is the case (0 uppercase, 1 lowercase)
    //7th bit is always 1 for an ASCII letter
    //8th bit is always 0 for an ASCII letter

    //skip if not a valid letter (7th bit = 1, 8th bit = 0)
    if ( (iChar & 0xC0) != 0x40) {
      continue;
    }


    //set bits 6,7,8 to 0  
    //0x1F = 0001 1111
    iLetterPosition = iChar & 0x1F;
    console.log("c, position: " + c + ": " + iLetterPosition);

    //get the new letter position
    iNewLetterPosition = (iLetterPosition + iShift) % 26;
   

    //Convert letter position back to ASCII character by setting 7th bit to 1
    //7th bit: 0x40 = 0100 0000
    //Set back to original case using the original 6th bit
    //6th bit: 0x20 = 0010 0000
    cCipher =  (iNewLetterPosition |  0x40) | (0x20 & iChar); 
     

    strCipherText += String.fromCharCode(cCipher);
  }

  return strCipherText;
}

//base64Encode("hello");
console.log(makeUppercase("aAHelloWorld"));
console.log(caesarCipher("aAHello, WorldzZ!!", 1));
