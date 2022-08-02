import React, { useState, useRef, useCallback } from "react";
import produce from "immer";
import "bootstrap/dist/css/bootstrap.css";

// Grid size
const numRows = 25;
const numCols = 75;

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
];

const createEmptyGrid = () : number[][] => {
    const rows: number[][] = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0));
    };
    return rows;
};

const App = () => {
    const [running, setRunning] = useState<boolean>(false);
    const [grid, setGrid] = useState<number[][]>(() => {
        return createEmptyGrid();
    });

    // Ref of running
    const runningRef = useRef(running);
    runningRef.current = running;


    const runSimulation = useCallback(() => {
        if (!runningRef.current) return; // Validation

        setGrid((grid: number[][]) => {
            return produce(grid, (gridCopy: number[][]) => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numCols; j++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newJ = j + y;
                            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                                neighbors += grid[newI][newJ];
                            }
                        });
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][j] = 0;
                        } else if (grid[i][j] === 0 && neighbors === 3) {
                            gridCopy[i][j] = 1;
                        }
                    }
                }
            });
        });
        setTimeout(runSimulation, 100);
    }, []);

    // Button Controls =====================================================
    const handleStartStopButtonClick = () => {
        setRunning(!running);
        if (!running) {
            runningRef.current = true;
            runSimulation();
        }
    };
    
    const handleRandomButtonClick = () => {
        const rows: number[][] = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7) ? 1 : 0));
        };
        setGrid(rows);
    };
    
    // Styles ==============================================================
    const gridBoxStyle = (value: number) => {
        return {
            width: "20px",
            height: "20px",
            backgroundColor: value ? "black" : undefined,
            border: "solid 1px black"
        };
    };

    // Components ==========================================================
    const ButtonControls = () => <>
        <button 
            className={ running ? "btn btn-danger me-1" : "btn btn-primary me-1" } 
            onClick={() => handleStartStopButtonClick()}
        >{ running ? "Stop" : "Start"}</button>
        { !running && 
            <button 
                className="btn btn-primary me-1"
                onClick={() => handleRandomButtonClick()}
            >Random</button>
        }
        { !running && 
            <button 
                className="btn btn-primary me-1"
                onClick={() => setGrid(createEmptyGrid())}
            >Clear</button>
        }
    </>;

    const Grid = () => <div className="mt-2" style={{ display: "grid", gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
        { grid.map((rows, rowsIndex) => rows.map((col, colIndex) => {
            return <div
                key={`${rowsIndex}-${colIndex}`} 
                style={gridBoxStyle(grid[rowsIndex][colIndex])}
            />
        }))}
    </div>;

    // =====================================================================
    return <div className="m-5">
        <h1>Conway's Game of Life</h1>
        <div className="mt-1">
            {ButtonControls()}
            {Grid()}
        </div>
    </div>;
};

export default App;
