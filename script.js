import React, { Component } from 'react';

const GameDifficulty = [20, 50, 70];

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: GameDifficulty[props.difficultyLevel - 1],
      cols: 3,
      rows: 3,
      count: 0,
      blocks: [],
      emptyBlockCoords: [2, 2],
      indexes: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { cols, rows } = this.state;
    const count = cols * rows;
    const blocks = document.getElementsByClassName("puzzle_block");
    const indexes = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const blockIdx = x + y * cols;
        if (blockIdx + 1 >= count) break;
        const block = blocks[blockIdx];
        this.positionBlockAtCoord(blockIdx, x, y);
        block.addEventListener('click', () => this.onClickOnBlock(blockIdx));
        indexes.push(blockIdx);
      }
    }

    indexes.push(count - 1);
    this.setState({ count, blocks, indexes });
    this.randomize(this.state.difficulty);
  };

  randomize = (iterationCount) => {
    for (let i = 0; i < iterationCount; i++) {
      const randomBlockIdx = Math.floor(Math.random() * (this.state.count - 1));
      const moved = this.moveBlock(randomBlockIdx);
      if (!moved) i--;
    }
  };

  moveBlock = (blockIdx) => {
    const { blocks, emptyBlockCoords, indexes } = this.state;
    const block = blocks[blockIdx];
    const blockCoords = this.canMoveBlock(block);
    if (blockCoords !== null) {
      this.positionBlockAtCoord(blockIdx, emptyBlockCoords[0], emptyBlockCoords[1]);
      indexes[emptyBlockCoords[0] + emptyBlockCoords[1] * this.state.cols] = indexes[blockCoords[0] + blockCoords[1] * this.state.cols];
      emptyBlockCoords[0] = blockCoords[0];
      emptyBlockCoords[1] = blockCoords[1];
      this.setState({ emptyBlockCoords, indexes });
      return true;
    }
    return false;
  };

  canMoveBlock = (block) => {
    const { emptyBlockCoords } = this.state;
    const blockPos = [parseInt(block.style.left), parseInt(block.style.top)];
    const blockWidth = block.clientWidth;
    const blockCoords = [blockPos[0] / blockWidth, blockPos[1] / blockWidth];
    const diff = [Math.abs(blockCoords[0] - emptyBlockCoords[0]), Math.abs(blockCoords[1] - emptyBlockCoords[1])];
    const canMove = (diff[0] === 1 && diff[1] === 0) || (diff[0] === 0 && diff[1] === 1);
    return canMove ? blockCoords : null;
  };

  positionBlockAtCoord = (blockIdx, x, y) => {
    const { blocks } = this.state;
    const block = blocks[blockIdx];
    block.style.left = `${x * block.clientWidth}px`;
    block.style.top = `${y * block.clientWidth}px`;
  };

  onClickOnBlock = (blockIdx) => {
    if (this.moveBlock(blockIdx)) {
      if (this.checkPuzzleSolved()) {
        setTimeout(() => alert("Puzzle Solved!!"), 600);
      }
    }
  };

  checkPuzzleSolved = () => {
    const { indexes, emptyBlockCoords, cols } = this.state;
    for (let i = 0; i < indexes.length; i++) {
      if (i === emptyBlockCoords[0] + emptyBlockCoords[1] * cols) continue;
      if (indexes[i] !== i) return false;
    }
    return true;
  };

  setDifficulty = (difficultyLevel) => {
    const difficulty = GameDifficulty[difficultyLevel - 1];
    this.setState({ difficulty });
    this.randomize(difficulty);
  };

  render() {
    return (
      <div>
        {/* Your puzzle board JSX goes here */}
        {/* For example: */}
        {this.state.blocks.map((block, idx) => (
          <div key={idx} className="puzzle_block"></div>
        ))}
        {/* Difficulty buttons JSX goes here */}
        {/* For example: */}
        {GameDifficulty.map((difficulty, idx) => (
          <button
            key={idx}
            className={`difficulty_button${difficulty === this.state.difficulty ? ' active' : ''}`}
            onClick={() => this.setDifficulty(idx + 1)}
          >
            {difficulty}
          </button>
        ))}
      </div>
    );
  }
}

export default Game;
