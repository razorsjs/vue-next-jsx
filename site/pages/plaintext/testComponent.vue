<script lang="tsx">
import {FunctionalComponent} from 'vue'
const CounterExample: FunctionalComponent<{
  sss?: string
}> = (props) => {
  return (
    <div>
      {props.sss}
    </div>
);
}
export default CounterExample
</script>
