class Node {
    constructor(value, char, left, right) {
        this.val = value; // number of character occurrences  
        this.char = char; // character to be encoded  
        this.left = left;
        this.right = right;
    }
}

export class HuffmanTree {
    constructor(str) {
        // The first step is to count the frequency of characters  
        let hash = {};
        for (let i = 0; i < str.length; i++) {
            hash[str[i]] = ~~hash[str[i]] + 1;
        }
        this._hash = hash;

        // Constructing Huffman tree  
        this._huffmanTree = this.getHuffmanTree();

        // Look at the cross reference table, that is, what is the binary encoding of each character  
        this._codeBook = this.getHuffmanCode();

        // Final binary encoding  
        this._binaryStr = this.encode(str);

        // Calculate Compression Ratio
        this._compressionRatio = this.calculateCompressionRatio(str);
    }

    get compressionRatio() {
        return this._compressionRatio;
    }

    get binaryStr() {
        return this._binaryStr;
    }

    get codeBook() {
        return this._codeBook;
    }

    get huffmanTree() {
        return this._huffmanTree
    }

    // Constructing Huffman tree  
    getHuffmanTree() {
        // The number of occurrences of each character is node.val , tectonic forest  
        let forest = []
        for (let char in this._hash) {
            let node = new Node(this._hash[char], char);
            forest.push(node);
        }

        // When there is only one node left in the forest, the merging process is finished and the tree is generated  
        let allNodes = []; // stores the merged nodes, because any node in the forest cannot be deleted, otherwise. Left. Right will not find the node  
        while (forest.length !== 1) {
            // Find the two smallest trees in the forest and merge them  
            forest.sort((a, b) => {
                return a.val - b.val;
            });

            let node = new Node(forest[0].val + forest[1].val, '');
            allNodes.push(forest[0]);
            allNodes.push(forest[1]);
            node.left = allNodes[allNodes.length - 2]; // the left subtree places words with low frequency  
            node.right = allNodes[allNodes.length - 1]; // the right subtree places the word frequency high  

            // Delete the two smallest trees  
            forest = forest.slice(2);
            // Added tree join  
            forest.push(node);
        }

        // Generated Huffman tree  
        return forest[0];
    }

    // Traverse the Huffman tree and return a table of original characters and binary codes  
    getHuffmanCode() {
        let hash = {}; // cross reference table
        let traversal = (node, curPath) => {
            if (!node.length && !node.right) return;
            if (node.left && !node.left.left && !node.left.right) {
                hash[node.left.char] = curPath + '0';
            }
            if (node.right && !node.right.left && !node.right.right) {
                hash[node.right.char] = curPath + '1';
            }
            // Traverse to the left and add 0 to the path  
            if (node.left) {
                traversal(node.left, curPath + '0');
            }
            // Go right and add 1 to the path  
            if (node.right) {
                traversal(node.right, curPath + '1');
            }
        };
        traversal(this._huffmanTree, '');
        return hash;
    }

    // Returns the final compressed binary string  
    encode(originStr) {
        let result = '';
        for (let i = 0; i < originStr.length; i++) {
            result += this._codeBook[originStr[i]];
        }
        return result;
    }

    decode(binaryStr) {
        let result = '';
        const root = this._huffmanTree;
        let node = root;
        for (let i = 0; i < binaryStr.length; i++) {
            node = binaryStr[i] === '0' ? node.left : node.right;
            if (!node.left && !node.right) {
                result += String(node.char);
                node = root;
            }
        }
        return result;
    }

    calculateCompressionRatio(str) {
        const original = 8 * str.length;
        let compressed = 0;
        for (let i = 0; i < str.length; i++) {
            compressed += Number(this._codeBook[str[i]].length);
        }

        return (1 - (compressed / original)).toFixed(2);
    }
}