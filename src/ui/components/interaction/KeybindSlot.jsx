const KeybindSlot = ({ keybind, style = {} }) => {
  return (
    <div className="keybind-slot" style={style}>
      {keybind}
    </div>
  );
};

export default KeybindSlot;
