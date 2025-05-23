import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

// Clears the board iteratively
function clearBoard(boardSets: (React.Dispatch<React.SetStateAction<string>>)[][]) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      boardSets[i][j]("");
    }
  }
}



// Generates a new sudoku board, clears board first
// Logic is not properly implemented, so invalid boards get created
function generateBoard(boardSets: (React.Dispatch<React.SetStateAction<string>>)[][]) {
  clearBoard(boardSets);

  // Random int generator, only used here
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  // Fill between 10% - 40% of board
  const percent = (getRandomInt(30) + 10) * 0.01
  let count = Math.floor(percent * 81);

  while (count > 0) {
    const boxCoord = getRandomInt(81);
    const x = Math.floor(boxCoord / 9);
    const y = boxCoord % 9;
    const num = getRandomInt(10);
    boardSets[x][y](num.toString());
    count--;
  }
}


// Check if board is a winner
function checkBoard(board: (string)[][], setWin: React.Dispatch<React.SetStateAction<string>>) {
  const numCheck = new RegExp('[0-9]')
  // Check rows
  for (let i = 0; i < 9; i++) {
    let numSet = new Set<string>();
    for (let j = 0; j < 9; j++) {
      let num = board[i][j]
      if (numSet.has(num)) {
          setWin(":(")
          return
        }
        else if (numCheck.test(num)) {
          numSet.add(num)
        }
        else {
          setWin("No words please")
          return
        }
    }
  }

  // Check columns
  for (let i = 0; i < 9; i++) {
    let numSet = new Set<string>();
    for (let j = 0; j < 9; j++) {
      let num = board[j][i]
      if (numSet.has(num)) {
          setWin(":(")
          return
        }
        else if (numCheck.test(num)) {
          numSet.add(num)
        }
        else {
          setWin("No words please")
          return
        }
    }
  }

  // Check boxes
  for (let b = 0; b < 9; b++) {
    let numSet = new Set<string>;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let x = Math.floor(b / 3) + i;
        let y = (b % 3) + j;
        let num = board[x][y]

        if (numSet.has(num)) {
          setWin(":(")
          return
        }
        else if (numCheck.test(num)) {
          numSet.add(num)
        }
        else {
          setWin("No words please")
          return
        }
      }
    }
  }

  setWin("You Win!!!!")
}

export default function App() {
  // Create a nested array to store values
  let [title, setTitle] = useState("Sudoku :D")

  let board: (string)[][] = [];
  let boardSets: (React.Dispatch<React.SetStateAction<string>>)[][] = [];
  for (let i = 0; i < 9; i++) {
    let vals = [];
    let sets = [];
    for (let j = 0; j < 9; j++) {
      const [num, setNum] = useState<string>('')
      vals.push(num);
      sets.push(setNum);
    }
    board.push(vals);
    boardSets.push(sets);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 40, marginBottom: 40}}>{title}</Text>
      {board.map((row, indexX) => (
        <View key={indexX} style={{flexDirection:'row'}}>
          {row.map((box, indexY)=> (

            // Sudoku Boxes
            <TextInput key={indexY} 
              style={[
                ((indexY === 2) || (indexY === 5)) ? styles.rightBorder : styles.borderedBox,
                ((indexX === 2) || (indexX === 5)) ? styles.bottomBorder : styles.borderedBox,
                styles.borderedBox,
                ]}
              onChangeText={boardSets[indexX][indexY]}
              value={box}
              maxLength={1}
              caretHidden={true}
              keyboardType='number-pad'
              />

          ))}


        </View>
        // {row.map((box, indexY) => (
        //   <Text>jJJ</Text>
        // ))}
      ))}
      <View style={{flexDirection:'row', marginTop: 20}}>
        <Button title='Clear Board' onPress={() => {clearBoard(boardSets)}} />
        <Button title='New Board' onPress={() => {generateBoard(boardSets)}}/>
        <Button title='Check Board' onPress={() => {checkBoard(board, setTitle)}} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderedBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    minWidth: 50,
    maxWidth: 50,
    minHeight: 50,
    maxHeight: 50,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20
  },
  bottomBorder: {
    borderBottomColor: 'black'
  },
  topBorder: {
    borderTopColor: 'black'
  },
  leftBorder: {
    borderLeftColor: 'black'
  },
  rightBorder: {
    borderRightColor: 'black'
  },
});
