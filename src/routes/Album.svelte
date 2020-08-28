<script>
  export let params
  
  $: console.log(`Album: ${params.name}`)
  
  import { location, querystring } from 'svelte-spa-router'
  import Thumbs from '../components/Thumbs.svelte'
  import Image from '../components/Image.svelte'

  let bigPic
  $: bigPic = $querystring ? true : false

</script>


&nbsp &nbsp
{ #if bigPic }
  <Image/>
{:else}
  <Thumbs />
{/if}
  