import useStore from '../../zustand/store';


function _template() {
  const user = useStore((store) => store.user);

  return (
<div> _template </div>
  )
}


export default _template;