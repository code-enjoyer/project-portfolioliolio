<script lang="ts">
    import { HeaderSizeClass } from '$lib/enums/header-size-class';

    export let text: string = "Default Header";
    export let size: HeaderSizeClass = HeaderSizeClass.L;
</script>

<div class="m-0 text-gray-800 {size}">{text}</div>

<style>
    /*TODO: I don't know what I'm doing :)*/
</style>