# Interactive Braid Group Visualizations

This project is a web-based, interactive visualization of the Reidemeister moves from knot theory, built with a focus on a clean, responsive design using plain HTML, CSS, and JavaScript.

## Mathematical Background

In these visualizations, time is considered to flow from **top to bottom**. The strands can be understood as the worldlines of particles moving forward in time.

### The Braid Group

The **Braid Group on N strands**, denoted $B_N$, is the algebraic structure that describes the different ways N strands can be braided. It is defined by $N-1$ generators: $\sigma_1, \sigma_2, \ldots, \sigma_{N-1}$.

* The generator $\sigma_i$ represents the elementary braid where the $i$-th strand crosses **over** the $(i+1)$-th strand.
* Its inverse, $\sigma_i^{-1}$, represents the $i$-th strand crossing **under** the $(i+1)$-th strand.

These generators must satisfy two fundamental relations:

1.  **Commutativity for distant braids:** If two crossings do not share a strand (i.e., they are far apart), their order does not matter.

    $$
    \sigma_i \sigma_j = \sigma_j \sigma_i \quad \text{for} \quad |i-j| \ge 2
    $$

2.  **The Braid Relation (Yang-Baxter Equation):** This relation describes how three adjacent strands interact. It is the algebraic form of the Reidemeister III move.

    $$
    \sigma_i \sigma_{i+1} \sigma_i = \sigma_{i+1} \sigma_i \sigma_{i+1}
    $$

### The Reidemeister Moves

Two knots are topologically equivalent if one can be deformed into the other through a series of three fundamental moves, known as the Reidemeister moves.

* **Type I (Twist):** Adding or removing a kink in a single strand. Algebraically, this corresponds to the fact that a braid and its inverse cancel out: $\sigma_i \sigma_i^{-1} = 1$.
* **Type II (Poke):** Sliding one strand completely over or under another. This corresponds to creating or eliminating two crossings: $\sigma_i \sigma_{i+1} \sigma_i^{-1} \sigma_{i+1}^{-1} = 1$.
* **Type III (Slide):** Sliding a strand across a pre-existing crossing. This is the move visualized in this project and is described by the Braid Relation shown above.

## Live Demo

[**▶️ View the live animation here**](https://lufreitas0000.github.io/Reidermester/)

## Physical Applications

The Reidemeister moves, particularly the Type III move, are not just abstract mathematical concepts; they have deep and direct connections to physics.

The algebraic relation defining the Type III move is known in physics as the **Yang-Baxter equation**. This equation is a fundamental condition for the integrability of models in statistical mechanics and (1+1)-dimensional quantum field theories. It ensures that scattering processes are consistent, allowing for exact solutions. The strands of the braid represent the worldlines of particles, and the crossings represent their interactions.

## Future Work

This project will be expanded to include visualizations for the Type I and Type II Reidemeister moves.