// This is automatically generated code from pd4web.py script
// Extra definitions


// Setup function declarations
extern "C" void audce_L4_amb_rot_tilde_setup(void);
extern "C" void audce_L4_amb_3rd_tilde_setup(void);


// Object functions initialization
void Pd4WebInitExternals() {
    // Call the _setup functions for all externals
    audce_L4_amb_rot_tilde_setup();
    audce_L4_amb_3rd_tilde_setup();

    return;
};
