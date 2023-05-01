figma.showUI(__html__);

const convertRadiusToCssObj = (node: any) => {
  return {
    borderRadius: node.cornerRadius,
    borderTopLeftRadius: node.topLeftRadius,
    borderTopRightRadius: node.topRightRadius,
    borderBottomLeftRadius: node.bottomLeftRadius,
    borderBottomRightRadius: node.bottomRightRadius
  };
};

const getNodeProps = (node: any) => {
  const color = node.fills[0].color;

  return {
    id: node.id,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    color,
    ...convertRadiusToCssObj(node)
  };
};

const getNodeId = (node: any) => node.id;

figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'run-real-time') {
    figma.on("documentchange", (event) => {
      const nodes = figma.currentPage.selection;
    
      for (const change of event.documentChanges) {
          if (change.type === 'CREATE') {
            const nodeProps = getNodeProps(change.node);

            figma.ui.postMessage({type: 'onCreateNode', props: nodeProps });
          }

          if (change.type === 'DELETE') {
            const nodeId = getNodeId(change.node)

            figma.ui.postMessage({type: 'onDeleteNode', props: nodeId });
          }

          if (change.type === 'PROPERTY_CHANGE') {
            const nodesShape = nodes.map(node => getNodeProps(node));
          
            figma.ui.postMessage({type: 'onPropertyChange', props: nodesShape });
          }
        }
    });
  }

  if (msg.type === 'cancel') {
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  }
};
