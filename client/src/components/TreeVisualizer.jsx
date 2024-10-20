import React from "react";
import Tree from "react-d3-tree";

const TreeVisualizer = ({ ast }) => {
  const convertASTToTreeData = (node) => {
    if (!node) return null;

    const treeNode = {
      name: `${node.type}: ${node.value}`,
      attributes: {
        type: node.type,
        value: node.value,
      },
    };

    if (node.left || node.right) {
      treeNode.children = [];
      if (node.left) treeNode.children.push(convertASTToTreeData(node.left));
      if (node.right) treeNode.children.push(convertASTToTreeData(node.right));
    }

    return treeNode;
  };

  const treeData = convertASTToTreeData(ast);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 300, y: 50 }}
        separation={{ siblings: 2, nonSiblings: 2 }}
        nodeSize={{ x: 200, y: 100 }}
      />
    </div>
  );
};

export default TreeVisualizer;
