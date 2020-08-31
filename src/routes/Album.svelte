<script>
  export let params // 
  
  $: console.log(`Album: ${params.name}`)
  
  import { location, querystring } from 'svelte-spa-router'
  import Thumbs from '../components/Thumbs.svelte'
  import Image from '../components/Image.svelte'

  let bigPic  // single image or thumbnails
  $: bigPic = $querystring ? true : false // anything after '?' ?

</script>


&nbsp &nbsp
{ #if bigPic }
  <Image />
{:else}
  <Thumbs thumbsAlbum={params.name}/>
{/if}
  