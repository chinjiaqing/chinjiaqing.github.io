<template>
    <!-- Block: button -->
    <div class="button">
        <!-- Element: text -->
        <span class="button__text">Click me</span>
    </div>

    <!-- Block: button with Modifier: primary -->
    <div class="button button--primary">
        <!-- Element: text with Modifier: primary -->
        <span class="button__text">Click me</span>
    </div>

    <!-- Block: button with Modifier: secondary -->
    <div class="button button--secondary">
        <!-- Element: text with Modifier: secondary -->
        <span class="button__text">Click me</span>
    </div>
</template>

<style lang="scss">
@import "bem.scss";

@include B(button) {
    --color:#000;
    --bgColor:#000;
    display: inline-block;
    padding: 10px 20px;
    border: 1px solid;
    box-sizing: border-box;
    border-color: var(--color);
    color: white;
    cursor: pointer;
    margin: 0 10px;
    background: var(--bgColor);

    @include E(text) {
        font-size: 16px;
    }

    @include M(primary) {
        --color:#3498db;
        --bgColor:#3498db;
        @include E(text) {
            color: white;
        }
    }

    @include M(secondary) {
        --bgColor: #2ecc71;
        --color: #2ecc71;

        @include E(text) {
            color: white;
        }
    }
}


</style>
