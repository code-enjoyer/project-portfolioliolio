<script lang="ts">
    import type { NavbarItem } from '../models/navbar-item'
    import { page } from '$app/stores'

    export let navItems: NavbarItem[] = [
        {displayName: 'Home', path: '/'},
        {displayName: 'Contact', path: '/contact'},
        {displayName: 'Templates', path: '/templates'}
    ]

    $:currentPath  = $page.url.pathname
</script>

<nav class="navbar">
    <ul>
        {#each navItems as {displayName, path}}
        <li >
            <a href={path} class="navbar-item {currentPath === path ? 'active-path' : ''}">
                {displayName}
            </a>
        </li>
        {/each}
    </ul>
</nav>

<style>
    .navbar {
    height: 40px;
    align-content: center;
    padding-bottom: 5px;
    padding-left: 15px;
    background-color: #6320ee;
    }

    .navbar ul {
        display: flex;
        gap: 1rem;
    }

    .navbar-item  {
            transition: color 0.2s ease;
            color: #f8f0fb;

            &:hover, &.active-path {
                color: #cad5ca;
            }

            &:active {
                color:#8075ff;
            }
    }

</style>