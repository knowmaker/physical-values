document
  .getElementById("js-search-input")
  .addEventListener("input", (event) => find(event.target.value));

function quickSortAndUpdate(arrays, arrayName, left, right) {
  let pivotIndex;
  if (arrays[arrayName].length > 1) {
    pivotIndex = partition(arrays, arrayName, left, right);
    if (left < pivotIndex - 1) {
      quickSortAndUpdate(arrays, arrayName, left, pivotIndex - 1);
    }
    if (pivotIndex < right) {
      quickSortAndUpdate(arrays, arrayName, pivotIndex, right);
    }
  }
}

function partition(arrays, arrayName, left, right) {
  let pivot = arrays[arrayName][Math.floor((right + left) / 2)].score + 100;
  let i = left;
  let j = right;
  while (i <= j) {
    while (arrays[arrayName][i].score + 100 < pivot) {
      i++;
    }
    while (arrays[arrayName][j].score + 100 > pivot) {
      j--;
    }
    if (i <= j) {
      swapElements(arrays, i, j);
      i++;
      j--;
    }
  }
  return i;
}

function swapElements(arrays, i, j) {
  let temp = arrays.arrayR[i];
  arrays.arrayR[i] = arrays.arrayR[j];
  arrays.arrayR[j] = temp;

  temp = arrays.arrayG[i];
  arrays.arrayG[i] = arrays.arrayG[j];
  arrays.arrayG[j] = temp;

  temp = arrays.arrayL[i];
  arrays.arrayL[i] = arrays.arrayL[j];
  arrays.arrayL[j] = temp;
}

function find(inputValue) {
  // Ищем данные которые хоть как-то подходят
  let arrayResults = [];
  let arrayGK = [];
  let arrayLT = [];
  for (let raws of Object.keys(data)) {
    for (let lt of Object.keys(data[raws])) {
      for (let gk = 0; gk < data[raws][lt].length; gk++) {
        let gkData = data[raws][lt][gk];
        const result = fuzzysort.single(
          inputValue.toString(),
          gkData[Object.keys(gkData)].name.toString()
        );
        if (result != null) {
          arrayResults.push(result);
          arrayGK.push(Object.keys(gkData));
          arrayLT.push(lt);
        }
      }
    }
  }

  let arrays = { arrayR: arrayResults, arrayG: arrayGK, arrayL: arrayLT };
  quickSortAndUpdate(arrays, "arrayR", 0, arrays.arrayR.length - 1);

  let str = "";
  for (
    let i = arrayResults.length - 1;
    i > arrayResults.length - Math.min(arrayResults.length - 1, 5) - 2;
    i--
  ) {
    str +=
      '<p id="line"></p>' +
      fuzzysort.highlight(arrays.arrayR[i], "<b>", "</b>") +
      "<div style=”margin-left:1vw;”></div>" +
      arrays.arrayG[i] +
      "<div style=”margin-left:1vw;”></div>" +
      arrays.arrayL[i] +
      "</br>";
  }
  console.log(arrayResults);
  console.log(arrayResults.length);
  if (inputValue != "" && arrayResults.length > 0) {
    str += '<p id="line"></p>';
    const SearchedElement = document.getElementById("js-searched");
    SearchedElement.style.display = "block";
    SearchedElement.innerHTML = str;
  } else document.getElementById("js-searched").style.display = "none";
  return 0;
}
