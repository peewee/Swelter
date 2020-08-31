<script>
  export let thumbsAlbum

  import { bkt, album, pic } from '../stores.js'
  import { onMount } from 'svelte'
  import { location, querystring, replace } from 'svelte-spa-router'

  let thumbsHTML
  $: {
    console.log(`Thumbs thumbsAlbum: ${thumbsAlbum}`)
  // remote file name
    let albumManifest = `${ bkt+'/'+thumbsAlbum+'/manifesto.json'}`
    console.log(`Thumbs albumManifest: ${ albumManifest }`)
      
    // call async func
    thumbsHTML = markupThumbs(albumManifest)
/*****
  // async func
    async function markupThumbs( albumManifest ) {
      const response = await fetch ( albumManifest )

      if ( response.ok ){
        const json = await response.json()
        thumbsHTML = await markUp( json )
      }

      async function markUp( json ) {
        let albumS3 = bkt+'/'+thumbsAlbum
        let markup = ''
        json.images.forEach( img => {
          let id = img.id ? img.id : img.imgSrc.split('.', 1)[0]
          markup +=
            '<a href="/#/album/'+thumbsAlbum+'?'+img.imgSrc+'">'
            +'<img src="'+albumS3+'/'+img.imgSrc+'" id="'+id+'"></a>'
        })
        // console.log(`Thumbs markupThumbs: ${markup}`)
        return markup
      }
    }
*****/    
  } // end $: on change

  async function markupThumbs( albumManifest ) {
    const response = await fetch ( albumManifest )

    if ( response.ok ){
      const json = await response.json()
      thumbsHTML = await markUp( json )
    }

    async function markUp( json ) {
      let albumS3 = bkt+'/'+thumbsAlbum
      let markup = ''
      json.images.forEach( img => {
        let id = img.id ? img.id : img.imgSrc.split('.', 1)[0]
        markup +=
          '<a href="/#/album/'+thumbsAlbum+'?'+img.imgSrc+'">'
          +'<img src="'+albumS3+'/'+img.imgSrc+'" id="'+id+'"></a>'
      })
      // console.log(`Thumbs markupThumbs: ${markup}`)
      return markup
    }
  }





  function handleClick() { 
    console.log(`hullo clkt pic: ${ thumbsAlbum }/${ $pic }`) 
  }
  
</script>
<style>
    #pad {
      padding-top: 12px;
    }
  </style>

  <!--h1> Hullo Thumbs </h1-->
  <link href="/flexbin.css" rel="stylesheet">
  <div id='pad'>
    <main class="flexbin flexbin-margin">

      {#await thumbsHTML}
        <p>awaiting...</p>
      {:then thumbsHTML}
        {@html thumbsHTML}
      {:catch error}
        <p>error</p>
      {/await}

    </main>
  </div>