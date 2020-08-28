<script>

    //import { bkt } from './stores.js'
    import { onMount } from "svelte"
    import Router from 'svelte-spa-router'
    import {link, wrap, location, querystring} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { bkt, menuHeight, album, pic } from './stores'
    import Home from './routes/Home.svelte'
    import Album from './routes/Album.svelte'
    import NotFound from './routes/NotFound.svelte'

    $: album.set( $location.split('/').slice(2).join('/') ) // Ha Ha
    // $: activate( $album || $querystring )


    // let gallery = bkt+'/album.txt'
    let Albums = []

    onMount( async () => {
        const response = await fetch( bkt+'/album.txt' )
        const json = await response.json()
        Albums = json

        let menuBar = document.querySelector( '.menu' )
        menuHeight.set( menuBar.clientHeight )
        console.log(`Mbar mounted`)
    })


    const routes = {
      '/': Home,
      '/album/:name': Album,
      '*': NotFound
    }





//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
/**
	let name = 'Arse Hole'
	let age = 68;

    $: uppercaseName = name.toUpperCase();
    $: if ( name === 'Shit Head' ) { age = 99 };
    $: console.log( name );

    function bumpYear() { age += 1; }
    function changeName() { name = 'Shit Head'; }
**/
</script>

<style>

	ul.menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;

    background-color: rgba( 230, 230, 230, 0.8 );
	}

	ul.menu li {
		float: left;
	}

	ul.menu li a {
		display: block;
		opacity: .85;
		text-align: center;
		padding: 6px 12px;
		text-decoration: none;
	}

	ul.menu li a:hover {
		color: white;
		background-color: rgba( 130, 130, 130, 0.8 );
	}

	ul.menu li a:active {
		color: white;
		background-color: rgba( 64, 64, 64, 0.8 );
	}

	:global( ul.menu li a.active ) {
		color: white;
		background-color: rgba( 64, 64, 64, 0.8 );
	}
	:global( ul.menu li a ) {
		color: black;
    }

</style>

<Router {routes}  />

<div class = 'menu-bar'>
  <slot></slot>

  <ul class="menu">
    <div>
      <li>
        <a href='/'
          use:link use:active>
          Home
        </a>
      </li>

        {#each Albums as pix}
          <li>
            <a href='/album/{pix.album}'
              use:link use:active
              class='anchor'
            > {pix.album} </a>
          </li>
        {/each}

    </div>
  </ul>

</div>


<!--h1>Hello {uppercaseName}, I'm { age }!</h1>

<button on:click="{bumpYear}">Grow Up</button>
<button on:click="{changeName}">Caps</button-->
