<script>
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { location, querystring, push, pop, replace } from 'svelte-spa-router'
    import { bkt, menuHeight, album, pic } from '../stores.js'
    // import xtype from 'xtypejs'
    // let xtype = require('xtypejs')

    let albumManifesto
    let backdrop
      , backdropStyle
  
      ///, bdPortrait
      , bdW
      , bdH
    
    let pixList = []
      , Pic
      , picStyle
      , picW
      , picH
      
      , jSrc
      , kSrc
      , isJay = false

      , isPortrait
      , portrait
      , landscape

    let navIcon
      , isNorth
      , isWest
      , isEast
      , isSouth


    $: {  // bigPic starter action
      jSrc = `${bkt}/${$album}/${$querystring}` 
      kSrc = `${bkt}/${$album}/${$querystring}`
    }

    
    $: albumManifesto = `${ bkt+'/'+$album+'/manifesto.json'}`


    const getCatalogue = async ( manifesto ) => {
      let res = await fetch ( manifesto )
      if ( res.ok ) {
        let json = await res.json()
        json.images.forEach( image => {
          pixList.push( image )
        })
      }
    }
    

  /***********************    on Mount Event    *************************/
    onMount(async () => {
      
      await getCatalogue( `${ bkt+'/'+$album+'/manifesto.json'}` )
      
      if (isNaN(index)) 
        index = await pixList.findIndex(o => o.imgSrc == decodeURIComponent(`${$querystring}`))
      await console.log(`onMount pixList; ${pixList.length}, index: ${index} `)

      backdrop = await document.querySelector( '.backdrop' )
      backdropStyle = await getComputedStyle( backdrop )
      bdW = await parseInt(backdropStyle.getPropertyValue("width"), 10)
      bdH = await parseInt(backdropStyle.getPropertyValue("height"), 10)
      //bdAspect = bdH / bdW
      // bdPortrait = (bdH/bdW)>1 ? true : false
      //if ( bdAspect < 1 )
      console.log(`HULLO on Mount backdrop W: ${bdW}, H: ${bdH}`)


    }) // END onMount

 
  /***********************    window Resize event    *************************/    
    window.addEventListener( 'resize', () => {
    
      let matchH = bdW - picW*bdH/picH
        , matchW = bdH - picH*bdW/picW

      portrait = matchH > matchW ? true : false
      landscape = !portrait

      isNorth = isEast = isSouth = isWest =  false
    })

  /*********************  mouse in & out   *********************/
    function click(e) {
      console.log(`x: ${e.clientX}, y: ${e.clientY}`)
      console.log(e)
      e.preventDefault()
    }
    function mouseIn( e ) {
      navIcon = e.target.id
      if (e.target.id == 'north') isNorth = true
      if (e.target.id == 'east') isEast = true
      if (e.target.id == 'south') isSouth = true
      if (e.target.id == 'west') isWest = true
      e.preventDefault()
    }
    function mouseOut( e ) {
      if (e.target.id == 'north') isNorth = false
      if (e.target.id == 'east') isEast = false
      if (e.target.id == 'south') isSouth = false
      if (e.target.id == 'west') isWest = false
      e.preventDefault()
    }
    function Enter( e ) {}
    function Exit( e ) {
      console.log(`Exit ${e.target.id}`)
      isNorth = isEast = isSouth = isWest = false
      e.preventDefault()
    }

  /************************  iconClick  ************************/
    let index /* pic-pointer */
      
    const iconClick = async ( e ) => {
      let clkt = e.target.alt

      if (clkt === 'east' || clkt === 'west' ) {

        if (clkt === 'east') {
          if ( ++index >= pixList.length ) index = 0
        } else { //west
          if (--index < 0) index = pixList.length-1 
        }

        isJay = !isJay
        if (isJay) {
          jSrc = `${bkt}/${$album}/${pixList[index].imgSrc}`
        } else {
          kSrc = `${bkt}/${$album}/${pixList[index].imgSrc}`
        }

        replace(`${$location}?${pixList[index].imgSrc}`)
        console.log(`iconClick isJay: ${isJay}, Stuff URL`)

      } else if (clkt === 'south') {
        console.log(`clicked ${clkt}`)
      }
    }

    let jay
      , kay

    function loadedJ(){
      picAspect( jay )
    }
    function loadedK(){
      picAspect( kay )
    }

    function picAspect( pic ) {
      picW = pic.naturalWidth
      picH = pic.naturalHeight

      let matchH = bdW - picW*bdH/picH
        , matchW = bdH - picH*bdW/picW

      portrait = matchH > matchW ? true : false
      landscape = !portrait

      console.log(`picAspect() loaded!!
        backdrop W: ${bdW}, H: ${bdH}
        Pic W: ${picW}, H: ${picH}
        portrait: ${portrait},
        landscape: ${landscape}
      `)
    }
 
</script>


<!--••••••••••••••••••••••••••••••• HTML •••••••••••••••••••••••••••••••-->
  <svelte:window bind:innerWidth={bdW} bind:innerHeight={bdH} />
  <div class='backdrop'>

    {#if isJay}
      <img src={jSrc} alt='Jay' class='scented jay' 
        class:portrait class:landscape transition:fade
        bind:this={jay} on:load={loadedJ}
      />
    {:else}
      <img src={kSrc} alt='Kay' class='scented kay' 
        class:portrait class:landscape transition:fade 
        bind:this={kay} on:load={loadedK}
      />
    {/if}
  
    <div class='catch west' id='west' on:mouseenter={mouseIn} on:mouseleave={mouseOut}>
      {#if isWest}
      <img src='/BoomerLft.svg' class='navIco' id='icoWest' alt='west' transition:fade on:click={iconClick} />
      {/if}
    </div>
    <div class='catch south' id='south' on:mouseenter={mouseIn} on:mouseleave={mouseOut} >
      {#if isSouth} 
        <img src='/TwoBoomers.svg' class='navIco' id='icoSouth' alt='south' transition:fade on:click={iconClick}/>
      {/if}
    </div>
    <div class='catch east' id='east' on:mouseenter={mouseIn} on:mouseleave={mouseOut} >
      {#if isEast} 
        <img src='/BoomerRt.svg' class='navIco' id='icoEast' alt='east' transition:fade on:click={iconClick} />
      {/if}
    </div>

  </div>
<!--••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••--> 


<style>
    .catch { 
      position: fixed;
      /*background: papayawhip;
      opacity: 0.25;*/
    }
    .north {
      top: 30px;
      left: 25%;
      width: 50%;
      height: calc(25% - 30px);
    }
    .west {
      top: 25%;
      left: 0px;
      width: 25%;
      height: 50%;
    }
    .south {
      top: 75%;
      left: 25%;
      width: 50%;
      height: 25%;
    }
    .east {
      top: 25%;
      left: 75%;
      width: 25%;
      height: 50%;
    }


    .navIco {
      position: relative;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
      opacity: 0.5;
      /*background: whitesmoke;*/
    }
    #icoNorth {
      height: 70%;
      width: auto;
    }
    #icoWest {
      height: 50%;
      width: auto;
    }
    #icoSouth {
      /*top: 33%;*/
      height:50%;
      width: auto;
    } 
    #icoEast {
      height: 50%;
      width: auto;
    }


    .backdrop {
      position: relative;
      background: rgba(255, 200, 100, 0.1);
      background: none;
      
      left: 0;
      width: 100%;
      height: 100%;
      height: calc(100% - 30px);
      margin-top: 4px;
      padding: 0;
      /*border: 1px dotted red*/
    }

    .scented {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
    }
    .landscape {
      width: 100%;
      height: auto;
    }
    .portrait {
      width: auto;
      height: 100%;
    /*  max-height: 580px; YES! works! */
    }

</style>
