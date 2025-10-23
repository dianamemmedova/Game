
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let vsComputer = false;
        let scores = { X: 0, O: 0, draw: 0 };

        const cells = document.querySelectorAll('.cell');
        const statusDisplay = document.getElementById('status');

        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        function handleCellClick(e) {
            const index = e.target.getAttribute('data-index');

            if (board[index] !== '' || !gameActive) return;

            makeMove(index, currentPlayer);

            if (!checkWinner() && gameActive) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                statusDisplay.textContent = `Oyunçu ${currentPlayer} növbəsi`;

                if (vsComputer && currentPlayer === 'O' && gameActive) {
                    setTimeout(computerMove, 500);
                }
            }
        }

        function makeMove(index, player) {
            board[index] = player;
            cells[index].textContent = player;
            cells[index].classList.add(player.toLowerCase());
            cells[index].disabled = true;
        }

        function computerMove() {
            let bestMove = findBestMove();
            
            if (bestMove !== -1) {
                makeMove(bestMove, 'O');
                
                if (!checkWinner() && gameActive) {
                    currentPlayer = 'X';
                    statusDisplay.textContent = 'Oyunçu X növbəsi';
                }
            }
        }

        function findBestMove() {
            
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    if (checkWinForPlayer('O')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // eger oyuncunun qazanacaqini gorurse oyuncunu bloklayir
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    if (checkWinForPlayer('X')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // Mərkəz xanaya üstünlük ver -qazanmaqin vacib sertlerinden biride budur qazanmaq sansin daha cox olur
            if (board[4] === '') return 4;

            // Künc xanalara üstünlük ver --- merkezi xana ile basladiqimiz zaman kuclere usdunluk veririk
            const corners = [0, 2, 6, 8];
            for (let corner of corners) {
                if (board[corner] === '') return corner;
            }

            // İstənilən boş xana ---- eger sertler  odenmirse isdenilen bir bos xanaya yerlesdir
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') return i;
            }

            return -1;
        }

        function checkWinForPlayer(player) {
            return winPatterns.some(pattern => {
                return pattern.every(index => board[index] === player);
            });
        }

        function checkWinner() {
            let winner = null;
            let winningPattern = null;

            for (let pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    winner = board[a];
                    winningPattern = pattern;
                    break;
                }
            }

            if (winner) {
                gameActive = false;
                statusDisplay.textContent = `🎉 Oyunçu ${winner} qalib gəldi!`;
                scores[winner]++;
                updateScores();
                
                winningPattern.forEach(index => {
                    cells[index].classList.add('winner-highlight');
                });
                
                return true;
            }

            if (!board.includes('')) {
                gameActive = false;
                statusDisplay.textContent = '🤝 Heç-heçə!';
                scores.draw++;
                updateScores();
                return true;
            }

            return false;
        }

        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            statusDisplay.textContent = 'Oyunçu X başlayır';

            cells.forEach(cell => {
                cell.textContent = '';
                cell.disabled = false;
                cell.classList.remove('x', 'o', 'winner-highlight');
            });
        }

        function toggleMode() {
            vsComputer = !vsComputer;
            const modeBtn = document.querySelector('.mode');
            
            if (vsComputer) {
                modeBtn.textContent = '👥 İki oyunçu';
                statusDisplay.textContent = 'Sən X, Kompüter O';
            } else {
                modeBtn.textContent = '🤖 Kompüter ilə oyna';
                statusDisplay.textContent = 'İki oyunçu rejimi';
            }
            
            resetGame();
        }

        function updateScores() {
            document.getElementById('scoreX').textContent = scores.X;
            document.getElementById('scoreO').textContent = scores.O;
            document.getElementById('scoreDraw').textContent = scores.draw;
        }
