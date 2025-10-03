const Checkbox = ({ id, label, checked, onChange, style = {} }) => {
  const handleClick = (e) => {
    if (e.target.type !== 'checkbox') {
      onChange(!checked);
    }
  };

  return (
    <div
      className="checkbox-item"
      style={style}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.checked);
        }}
        className={`checkbox ${checked ? 'checkbox-checked' : ''}`}
      />
      <label
        htmlFor={id}
        className="checkbox-item-label"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
